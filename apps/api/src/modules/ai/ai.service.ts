import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { getRelevantKnowledge, APPLICATION_KNOWLEDGE } from './knowledge-base';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private enabled: boolean;
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    this.apiKey = this.config.get<string>('ai.grokApiKey') || '';
    this.apiUrl = this.config.get<string>('ai.grokApiUrl', 'https://api.x.ai/v1');
    this.model = this.config.get<string>('ai.grokModel', 'grok-2-latest');
    this.enabled =
      !!this.apiKey &&
      this.apiKey !== 'YOUR_GROK_API_KEY_HERE' &&
      this.apiKey !== 'your-grok-api-key-here' &&
      this.apiKey.length > 20;

    if (!this.enabled) {
      this.logger.warn('⚠️ Grok AI is disabled - API key not configured properly');
      this.logger.warn(`API Key length: ${this.apiKey?.length || 0}`);
    } else {
      this.logger.log(`✅ Grok AI initialized with model: ${this.model}`);
      this.logger.log(`API URL: ${this.apiUrl}`);
      this.logger.log(`API Key: ${this.apiKey.substring(0, 10)}...`);
    }
  }

  private async callGrokAPI(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: any[] = [];

      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      messages.push({ role: 'user', content: prompt });

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000, // 15 seconds timeout
        },
      );

      return response.data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - AI service took too long to respond');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
      if (error.response?.status === 404) {
        throw new Error('API endpoint not found - check model name');
      }
      this.logger.error('Grok API call failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async summarizeContent(content: string, maxWords = 50): Promise<string | null> {
    if (!this.enabled) return null;
    try {
      const prompt = `Summarize the following content in ${maxWords} words or less. Be concise and capture the key points:\n\n${content}`;
      return await this.callGrokAPI(prompt);
    } catch (err) {
      this.logger.warn('AI summarization failed', err);
      return null;
    }
  }

  async generateTags(content: string): Promise<string[]> {
    if (!this.enabled) return [];
    try {
      const prompt = `Extract 3-7 relevant tags/keywords from this content. Return only a JSON array of lowercase strings, no explanation:\n\n${content}`;
      const text = await this.callGrokAPI(prompt);
      const match = text.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch {
      return [];
    }
  }

  async generateDailyDigest(userId: string, recentContent: string[]): Promise<string> {
    if (!this.enabled) return 'AI digest unavailable';
    try {
      const contentSample = recentContent.slice(0, 10).join('\n---\n');
      const systemPrompt = 'You are an internal company assistant.';
      const prompt = `Create a brief, engaging daily digest summary (3-4 sentences) based on these recent company updates. Be professional and highlight the most important items:\n\n${contentSample}`;
      return await this.callGrokAPI(prompt, systemPrompt);
    } catch {
      return 'Unable to generate digest at this time.';
    }
  }

  async generateMeetingRecap(notes: string): Promise<string> {
    if (!this.enabled) return notes;
    try {
      const prompt = `Convert these meeting notes into a structured recap with: Key Decisions, Action Items, and Next Steps. Format as clean markdown:\n\n${notes}`;
      return await this.callGrokAPI(prompt);
    } catch {
      return notes;
    }
  }

  async suggestRelatedContent(
    content: string,
    contentPool: Array<{ id: string; title: string; excerpt: string }>,
  ): Promise<string[]> {
    if (!this.enabled || contentPool.length === 0) return [];
    try {
      const poolText = contentPool
        .slice(0, 20)
        .map((c) => `ID:${c.id} | ${c.title}: ${c.excerpt}`)
        .join('\n');

      const prompt = `Given this content:\n"${content.slice(0, 500)}"\n\nFrom this list, return the IDs of the 3 most related items as a JSON array:\n${poolText}`;
      const text = await this.callGrokAPI(prompt);
      const match = text.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch {
      return [];
    }
  }

  async answerQuestion(
    question: string,
    context: string,
    conversationHistory?: Array<{ role: string; content: string }>,
  ): Promise<string> {
    if (!this.enabled) {
      return '⚠️ AI Customer Support is currently unavailable. Please contact your administrator to configure the API key.';
    }

    // Retry logic for resilience
    let lastError: any;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        this.logger.log(`📝 Processing (Attempt ${attempt}): "${question.substring(0, 60)}..."`);

        // Get relevant knowledge based on the question
        const relevantKnowledge = getRelevantKnowledge(question);

        const systemPrompt = `You are AI Customer Support for 2coms Corporate Intranet Platform.

**YOUR ROLE:** Answer questions about the platform accurately and concisely, like a professional Telegram bot.

**RESPONSE STYLE:**
✓ Be direct and concise (2-4 sentences or bullet points)
✓ Use simple, clear language
✓ Provide step-by-step instructions when needed
✓ Use emojis sparingly for clarity
✓ No lengthy explanations unless asked
✓ Format with **bold** for key terms
✓ Use bullet points for lists
✓ Use numbered steps for procedures

**PLATFORM FEATURES:**

📰 **Feed** - Social posts with reactions, comments, hashtags. Click "Create Post" button to share updates.

📢 **Announcements** - Official company updates. Admins can create with priority levels (High/Medium/Low).

📚 **Knowledge Hub** - Company wiki with articles. Search, browse categories, or create new articles.

📄 **Documents** - File storage and management. Upload files, create folders, organize documents.

🖼️ **Gallery** - Photo and video sharing. Upload media, create albums, view team photos.

👥 **People Directory** - Team member profiles. Search by name, department, or skills. View org chart.

🏆 **Recognition** - Give kudos and badges. Click "Give Recognition", select colleague, choose badge, add message.

📅 **Events** - Calendar and meetings. Create events, RSVP, add virtual meeting links.

🔍 **Search** - Global search across all content. Use filters for specific content types.

⚙️ **Admin** - User management, moderation, analytics (admin only).

🏠 **Dashboard** - Overview with AI digest, quick stats, recent activity.

**HOW TO ANSWER:**

1. For "how to" questions: Give numbered steps
2. For "what is" questions: Brief explanation + main use case
3. For "where is" questions: Exact navigation path
4. For troubleshooting: Quick solution or workaround
5. For features: What it does + how to access it

**EXAMPLE RESPONSES:**

Q: "How do I create a post?"
A: "To create a post:
1. Click the **Create Post** button (top right or in Feed)
2. Type your message
3. Add hashtags with # if needed
4. Click **Post** to publish

Your post will appear in the company feed instantly."

Q: "How to upload documents?"
A: "Go to **Documents** page → Click **Upload** button → Select files → Choose folder (optional) → Click **Upload**. Supported formats: PDF, DOC, images, videos."

Q: "What is Recognition?"
A: "**Recognition** lets you give kudos to colleagues. You can award badges (Star Performer, Team Player, etc.) with points. Recipients earn points shown on leaderboards."

**IMPORTANT:**
- Always provide accurate information from the knowledge base
- Keep responses short and actionable
- Use conversation history for context
- If unsure, say "I don't have that information" and suggest alternatives
- Never make up features or steps

${relevantKnowledge.substring(0, 3000)}

Now answer the user's question concisely and accurately.`;

        // Build messages array with conversation history
        const messages: any[] = [{ role: 'system', content: systemPrompt }];

        // Add conversation history — strip system messages and empty content to avoid 400
        if (conversationHistory && conversationHistory.length > 0) {
          const cleaned = conversationHistory
            .filter((m) => m.role !== 'system' && typeof m.content === 'string' && m.content.trim().length > 0)
            .slice(-6); // keep last 6 (3 pairs)
          messages.push(...cleaned);
        }

        // Add current question with context
        const userPrompt =
          context && context.trim().length > 20
            ? `COMPANY CONTEXT:\n${context.substring(0, 2500)}\n\nQUESTION: ${question}\n\nProvide a helpful answer using the company context and your knowledge.`
            : `QUESTION: ${question}\n\nProvide a helpful answer based on your knowledge.`;

        messages.push({ role: 'user', content: userPrompt });

        this.logger.log('🤖 Sending request to Grok...');

        // Call API with full conversation
        const response = await axios.post(
          `${this.apiUrl}/chat/completions`,
          {
            model: this.model,
            messages,
            temperature: 0.5,
            max_tokens: 512,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          },
        );

        const aiResponse = response.data.choices[0]?.message?.content?.trim() || '';

        if (!aiResponse || aiResponse.length === 0) {
          throw new Error('Empty response from AI');
        }

        this.logger.log(`✅ Response generated (${aiResponse.length} chars) on attempt ${attempt}`);
        return aiResponse;
      } catch (error) {
        lastError = error;
        const detail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        this.logger.error(`❌ Attempt ${attempt} failed: ${detail}`);

        if (attempt < 2) {
          this.logger.log(`⏳ Retrying in 1 second...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    // All retries failed
    this.logger.error('❌ All retry attempts failed:', lastError?.message);

    if (lastError?.message?.includes('timeout')) {
      return '⏳ Request timeout. Please try a simpler question.';
    }

    if (
      lastError?.message?.includes('API_KEY_INVALID') ||
      lastError?.message?.includes('401') ||
      lastError?.message?.includes('403')
    ) {
      return '🔒 API key is invalid. Please contact your administrator.';
    }

    if (lastError?.message?.includes('quota') || lastError?.message?.includes('429')) {
      return '🚧 Service limit reached. Please try again later.';
    }

    return `⚠️ I'm having trouble right now. Please try again in a moment.`;
  }

  async semanticSearch(
    query: string,
    documents: Array<{ id: string; content: string }>,
  ): Promise<string[]> {
    if (!this.enabled || documents.length === 0) return [];
    try {
      const docList = documents
        .slice(0, 30)
        .map((d) => `ID:${d.id} | ${d.content.slice(0, 200)}`)
        .join('\n');

      const prompt = `Find the most relevant document IDs for this search query: "${query}"\n\nDocuments:\n${docList}\n\nReturn only a JSON array of the top 5 most relevant IDs, ordered by relevance.`;
      const text = await this.callGrokAPI(prompt);
      const match = text.match(/\[.*\]/s);
      return match ? JSON.parse(match[0]) : [];
    } catch {
      return [];
    }
  }
}
