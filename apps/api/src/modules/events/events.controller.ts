import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { EventsService } from './events.service';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private service: EventsService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('upcoming') upcoming?: string,
  ) {
    return this.service.findAll(tenantId, {
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      status,
      upcoming: upcoming === 'true',
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
  create(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Post(':id/rsvp')
  @HttpCode(HttpStatus.OK)
  rsvp(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('status') status: string,
  ) {
    return this.service.rsvp(id, userId, status || 'GOING');
  }
}
