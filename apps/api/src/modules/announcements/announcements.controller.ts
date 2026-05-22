import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/auth.decorator';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { AnnouncementsService } from './announcements.service';
import { UserRole } from '@intranet/types';

@ApiTags('Announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'announcements', version: '1' })
export class AnnouncementsController {
  constructor(private service: AnnouncementsService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('limit') limit?: number,
    @Query('pinned') pinned?: string,
    @Query('page') page?: number,
  ) {
    return this.service.findAll(tenantId, {
      limit: limit ? +limit : 20,
      pinned: pinned === 'true' ? true : pinned === 'false' ? false : undefined,
      page: page ? +page : 1,
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.service.findOne(id, tenantId, userId);
  }

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.DEPARTMENT_ADMIN, UserRole.MODERATOR)
  create(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Post(':id/acknowledge')
  @HttpCode(HttpStatus.OK)
  acknowledge(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.acknowledge(id, userId);
  }
}
