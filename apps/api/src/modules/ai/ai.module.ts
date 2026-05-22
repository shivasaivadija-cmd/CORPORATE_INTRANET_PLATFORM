import { Module, Global } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { EmbeddingService } from './embedding.service';
import { ModerationService } from './moderation.service';

@Global()
@Module({
  controllers: [AiController],
  providers: [AiService, EmbeddingService, ModerationService],
  exports: [AiService, EmbeddingService, ModerationService],
})
export class AiModule {}
