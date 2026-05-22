import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';

@Module({
  controllers: [AdminController, ModerationController],
  providers: [AdminService, ModerationService],
})
export class AdminModule {}
