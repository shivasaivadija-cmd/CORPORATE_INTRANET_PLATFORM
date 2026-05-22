import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { FeedRankingService } from './feed-ranking.service';
import { AiModule } from '@modules/ai/ai.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'feed' }),
    AiModule,
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedRankingService],
  exports: [FeedService],
})
export class FeedModule {}
