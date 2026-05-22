import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AiService } from '@modules/ai/ai.service';
import slugify from 'slugify';

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async findAll(tenantId: string, query: { page?: number; limit?: number; categoryId?: string; search?: string }) {
    const { page = 1, limit = 20, categoryId, search } = query;
    const where: any = { tenantId, isPublished: true };
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.knowledgeArticle.findMany({
        where,
        select: {
          id: true, title: true, slug: true, excerpt: true, coverImageUrl: true,
          tags: true, aiTags: true, viewCount: true, likeCount: true,
          createdAt: true, updatedAt: true,
          author: { select: { id: true, displayName: true, avatarUrl: true } },
          category: { select: { id: true, name: true, color: true } },
        },
        orderBy: { viewCount: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.knowledgeArticle.count({ where }),
    ]);

    return { data: articles, meta: { total, page, limit } };
  }

  async findOne(id: string, tenantId: string) {
    const article = await this.prisma.knowledgeArticle.findFirst({
      where: { id, tenantId },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true, jobTitle: true } },
        category: true,
      },
    });
    if (!article) throw new NotFoundException('Article not found');

    await this.prisma.knowledgeArticle.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return article;
  }

  async create(tenantId: string, authorId: string, dto: any) {
    const slug = slugify(dto.title, { lower: true, strict: true });
    const uniqueSlug = `${slug}-${Date.now()}`;

    const article = await this.prisma.knowledgeArticle.create({
      data: {
        tenantId,
        authorId,
        title: dto.title,
        slug: uniqueSlug,
        content: dto.content,
        richContent: dto.richContent,
        excerpt: dto.excerpt || dto.content.slice(0, 200),
        categoryId: dto.categoryId,
        tags: dto.tags || [],
        departmentId: dto.departmentId,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
      },
    });

    // AI processing
    const [aiSummary, aiTags] = await Promise.all([
      this.aiService.summarizeContent(dto.content, 60),
      this.aiService.generateTags(dto.content),
    ]);

    if (aiSummary || aiTags.length) {
      await this.prisma.knowledgeArticle.update({
        where: { id: article.id },
        data: { aiSummary: aiSummary || undefined, aiTags },
      });
    }

    return article;
  }

  async getCategories(tenantId: string) {
    return this.prisma.knowledgeCategory.findMany({
      where: { tenantId },
      include: { _count: { select: { articles: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getComments(articleId: string) {
    const comments = await this.prisma.articleComment.findMany({
      where: { articleId, parentId: null },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true, jobTitle: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { data: comments };
  }

  async addComment(articleId: string, authorId: string, content: string) {
    const comment = await this.prisma.articleComment.create({
      data: { articleId, authorId, content },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true, jobTitle: true } },
      },
    });
    return comment;
  }
}
