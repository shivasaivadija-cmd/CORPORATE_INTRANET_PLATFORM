import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { TenantId } from '@common/decorators/user.decorator';
import { ModerationService } from './moderation.service';

@ApiTags('Admin - Moderation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR')
@Controller({ path: 'admin/moderation', version: '1' })
export class ModerationController {
  constructor(private service: ModerationService) {}

  @Get('posts')
  getPosts(@TenantId() tenantId: string, @Query('filter') filter?: string) {
    return this.service.getPosts(tenantId, filter);
  }

  @Patch('posts/:id/approve')
  approvePost(@Param('id') postId: string, @TenantId() tenantId: string) {
    return this.service.approvePost(postId, tenantId);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') postId: string, @TenantId() tenantId: string) {
    return this.service.deletePost(postId, tenantId);
  }
}
