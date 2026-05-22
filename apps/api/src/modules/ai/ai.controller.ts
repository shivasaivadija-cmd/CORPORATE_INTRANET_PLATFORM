import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { AiService } from './ai.service';
import { PrismaService } from '@database/prisma.service';
import { APPLICATION_KNOWLEDGE } from './knowledge-base';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {}

  @Post('assistant')
  async askAssistant(
    @Body() body: { question: string },
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
  ) {
    try {
      // Fetch recent articles as context
      const articles = await this.prisma.knowledgeArticle.findMany({
        where: { tenantId, isPublished: true },
        select: { title: true, excerpt: true, content: true },
        take: 15,
        orderBy: { viewCount: 'desc' },
      });

      const context = articles
        .map((a) => `- ${a.title}: ${a.excerpt || a.content.slice(0, 300)}`)
        .filter((c) => c.length > 20)
        .join('\n');

      const answer = await this.aiService.answerQuestion(body.question, context);

      if (!answer) {
        return {
          data: {
            answer: 'I encountered an issue processing your request. Please try again.',
          },
        };
      }

      return { data: { answer } };
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      return {
        data: {
          answer: `Error: ${error?.message || 'I encountered an error processing your question. Please try again.'}`,
        },
      };
    }
  }

  @Post('chat')
  async chat(
    @Body()
    body: { message: string; conversationHistory?: Array<{ role: string; content: string }> },
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
  ) {
    try {
      // Get user info for personalization
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          jobTitle: true,
          department: { select: { name: true } },
        },
      });

      // Fetch company context
      const [articles, announcements, recentPosts] = await Promise.all([
        this.prisma.knowledgeArticle.findMany({
          where: { tenantId, isPublished: true },
          select: { title: true, excerpt: true, content: true },
          take: 5,
          orderBy: { viewCount: 'desc' },
        }),
        this.prisma.announcement.findMany({
          where: { tenantId, publishedAt: { lte: new Date() } },
          select: { title: true, content: true },
          take: 3,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.post.findMany({
          where: { tenantId, publishedAt: { lte: new Date() } },
          select: { content: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      // Build rich context with comprehensive application knowledge
      const context = `
👤 **USER PROFILE:**
- Name: ${user?.firstName || 'Team Member'} ${user?.lastName || ''}
- Role: ${user?.jobTitle || 'Employee'}
- Department: ${user?.department?.name || 'Not specified'}

📚 **COMPANY KNOWLEDGE BASE** (Recent Articles):
${articles.length > 0 ? articles.map((a) => `✓ ${a.title}: ${a.excerpt || a.content.slice(0, 150)}`).join('\n') : '✓ No articles available yet'}

📢 **RECENT ANNOUNCEMENTS:**
${announcements.length > 0 ? announcements.map((a) => `✓ ${a.title}: ${a.content.slice(0, 120)}`).join('\n') : '✓ No recent announcements'}

🔥 **RECENT ACTIVITY:**
${recentPosts.length > 0 ? recentPosts.map((p) => `✓ ${p.content.slice(0, 100)}...`).join('\n') : '✓ Activity feed is ready'}

🎯 **PLATFORM INFORMATION:**
- Platform: ${APPLICATION_KNOWLEDGE.platform.name}
- Version: ${APPLICATION_KNOWLEDGE.platform.version}
- Total Features: ${Object.keys(APPLICATION_KNOWLEDGE.features).length}

💡 **INSTRUCTIONS:**
Use the comprehensive knowledge base to answer questions accurately. Provide detailed, step-by-step guidance. Reference specific features, processes, and best practices. Be conversational and helpful!`;

      const response = await this.aiService.answerQuestion(
        body.message,
        context,
        body.conversationHistory,
      );

      if (!response) {
        return {
          data: {
            response:
              "I'm having trouble processing that right now. Could you try rephrasing your question?",
          },
        };
      }

      return { data: { response } };
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      return {
        data: {
          response:
            "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        },
      };
    }
  }

  @Get('digest')
  async getDailyDigest(@CurrentUser('id') userId: string, @TenantId() tenantId: string) {
    const recentPosts = await this.prisma.post.findMany({
      where: { tenantId, publishedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      select: { content: true },
      take: 15,
      orderBy: { createdAt: 'desc' },
    });

    const digest = await this.aiService.generateDailyDigest(
      userId,
      recentPosts.map((p) => p.content),
    );

    return { data: { digest } };
  }

  @Post('summarize')
  async summarize(@Body() body: { content: string; maxWords?: number }) {
    const summary = await this.aiService.summarizeContent(body.content, body.maxWords);
    return { data: { summary } };
  }

  @Get('features')
  async getFeatures() {
    return {
      data: {
        features: APPLICATION_KNOWLEDGE.features,
        platform: APPLICATION_KNOWLEDGE.platform,
      },
    };
  }

  @Post('feature-help')
  async getFeatureHelp(
    @Body() body: { feature: string },
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
  ) {
    const featureKey = body.feature.toLowerCase().replace(/\s+/g, '');
    const feature = (APPLICATION_KNOWLEDGE.features as any)[featureKey];

    if (!feature) {
      return {
        data: {
          response: `I couldn't find specific information about "${body.feature}". Here are the available features: ${Object.keys(APPLICATION_KNOWLEDGE.features).join(', ')}. Would you like to know about any of these?`,
        },
      };
    }

    const helpText = `
🎯 **${feature.name}**

${feature.description}

${feature.howTo ? `📝 **How to use:**\n${feature.howTo.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}` : ''}

${feature.features ? `✨ **Key Features:**\n${feature.features.map((f: string) => `• ${f}`).join('\n')}` : ''}

${feature.commonIssues ? `🔧 **Common Issues:**\n${feature.commonIssues.map((issue: any) => `• ${issue.issue}: ${issue.solution}`).join('\n')}` : ''}
    `.trim();

    return { data: { response: helpText } };
  }
}
