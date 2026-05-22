import { Controller, Get, Patch, Param, Body, Query, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { UsersService } from './users.service';
import { PresenceService } from '@modules/websocket/presence.service';

class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  skills?: string[];
  socialLinks?: Record<string, string>;
  avatarUrl?: string;
  coverUrl?: string;
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private usersService: UsersService, private presenceService: PresenceService) {}

  @Get('me')
  async getMe(@CurrentUser('id') userId: string) {
    const user = await this.usersService.findMe(userId);
    return { data: user };
  }

  @Get('leaderboard')
  getLeaderboard(@TenantId() tenantId: string, @Query('limit') limit?: number) {
    return this.usersService.getLeaderboard(tenantId, limit ? +limit : 10);
  }

  @Get('org-chart')
  getOrgChart(@TenantId() tenantId: string) {
    return this.usersService.getOrgChart(tenantId);
  }

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.usersService.findAll(tenantId, { page: page ? +page : 1, limit: limit ? +limit : 20, search, departmentId });
  }

  @Get(':id')
  findById(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.usersService.findById(id, tenantId);
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('presence')
  async getPresence(@Body() body: { userIds: string[] }) {
    const presence = await this.presenceService.getBulkPresence(body.userIds);
    return { data: presence };
  }
}
