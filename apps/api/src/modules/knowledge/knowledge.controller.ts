import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { KnowledgeService } from './knowledge.service';

@ApiTags('Knowledge')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'knowledge', version: '1' })
export class KnowledgeController {
  constructor(private service: KnowledgeService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(tenantId, { page: page ? +page : 1, limit: limit ? +limit : 20, categoryId, search });
  }

  @Get('categories')
  getCategories(@TenantId() tenantId: string) {
    return this.service.getCategories(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.service.findOne(id, tenantId);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.service.getComments(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: { content: string },
  ) {
    return this.service.addComment(id, userId, dto.content);
  }

  @Post()
  create(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.service.create(tenantId, userId, dto);
  }
}
