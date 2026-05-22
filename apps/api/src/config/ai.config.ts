import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  // Grok AI (xAI) Configuration
  grokApiKey: process.env.GROK_API_KEY || process.env.XAI_API_KEY,
  grokModel: process.env.GROK_MODEL || 'grok-2-latest',
  grokApiUrl: process.env.GROK_API_URL || 'https://api.x.ai/v1',
  
  // Legacy Gemini (fallback)
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  geminiEmbeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
  
  enableAiModeration: process.env.ENABLE_AI_MODERATION === 'true',
  enableAiSummary: process.env.ENABLE_AI_SUMMARY !== 'false',
  enableSemanticSearch: process.env.ENABLE_SEMANTIC_SEARCH !== 'false',
}));
