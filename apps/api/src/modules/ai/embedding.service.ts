import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private genAI: GoogleGenerativeAI;
  private enabled: boolean;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('ai.geminiApiKey');
    this.enabled = !!apiKey && this.config.get('ai.enableSemanticSearch', true);
    if (this.enabled) {
      this.genAI = new GoogleGenerativeAI(apiKey!);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.enabled) return [];
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.config.get('ai.geminiEmbeddingModel', 'text-embedding-004'),
      });
      const result = await model.embedContent(text.slice(0, 2000));
      return result.embedding.values;
    } catch (err) {
      this.logger.warn('Embedding generation failed', err);
      return [];
    }
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  }

  rankBySimilarity<T extends { embedding: number[] }>(
    query: number[],
    items: T[],
    topK = 10,
  ): T[] {
    return items
      .map((item) => ({ ...item, score: this.cosineSimilarity(query, item.embedding) }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, topK);
  }
}
