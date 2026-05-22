import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/auth.decorator';
import { TenantId } from '@common/decorators/user.decorator';
import { AdminService } from './admin.service';
import { UserRole } from '@intranet/types';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private service: AdminService) {}

  @Get('stats')
  getStats(@TenantId() tenantId: string) {
    return this.service.getStats(tenantId);
  }

  @Get('audit-logs')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  getAuditLogs(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.getAuditLogs(tenantId, page ? +page : 1, limit ? +limit : 50);
  }

  @Get('settings')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  getSettings(@TenantId() tenantId: string) {
    return this.service.getTenantSettings(tenantId);
  }
}
