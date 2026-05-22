import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { RecognitionService } from './recognition.service';

@ApiTags('Recognition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'recognition', version: '1' })
export class RecognitionController {
  constructor(private service: RecognitionService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
  ) {
    return this.service.findAll(tenantId, { page: page ? +page : 1, limit: limit ? +limit : 20, userId });
  }

  @Get('badges')
  getBadges(@TenantId() tenantId: string) {
    return this.service.getBadges(tenantId);
  }

  @Post()
  give(
    @CurrentUser('id') giverId: string,
    @TenantId() tenantId: string,
    @Body() dto: { receiverId: string; badgeId: string; message: string; isPublic?: boolean },
  ) {
    return this.service.give(giverId, tenantId, dto);
  }
}
