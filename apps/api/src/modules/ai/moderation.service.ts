import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface ModerationResult {
  isSafe: boolean;
  toxicityScore: number;
  flags: string[];
  reason?: string;
}

@Injectable()
export class ModerationService implements OnModuleInit {
  private readonly logger = new Logger(ModerationService.name);
  private model: GenerativeModel;
  private enabled: boolean;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('ai.geminiApiKey');
    this.enabled = !!apiKey && this.config.get('ai.enableAiModeration', false);
    if (this.enabled) {
      const genAI = new GoogleGenerativeAI(apiKey!);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async moderateContent(content: string): Promise<ModerationResult> {
    if (!this.enabled) return { isSafe: true, toxicityScore: 0, flags: [] };

    try {
      const result = await this.model.generateContent(
        `Analyze this content for workplace policy violations. Return a JSON object with:
- isSafe (boolean): true if content is appropriate for a corporate environment
- toxicityScore (0-1): how toxic/inappropriate the content is
- flags (array): list of issues found (e.g., "harassment", "hate_speech", "spam", "inappropriate")
- reason (string, optional): brief explanation if not safe

Content: "${content.slice(0, 1000)}"

Return ONLY valid JSON, no markdown.`,
      );

      const text = result.response.text().trim();
      const match = text.match(/\{.*\}/s);
      if (match) return JSON.parse(match[0]);
    } catch (err) {
      this.logger.warn('Moderation check failed', err);
    }

    return { isSafe: true, toxicityScore: 0, flags: [] };
  }
}
