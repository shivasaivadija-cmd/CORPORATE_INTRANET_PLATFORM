import { Controller, Get, Post, Delete, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { SearchService } from './search.service';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(
    @TenantId() tenantId: string,
    @Query('q') query: string,
  ) {
    const results = await this.searchService.globalSearch(tenantId, query);
    return { data: results };
  }

  @Get('history')
  async getHistory(@CurrentUser('id') userId: string) {
    const history = await this.searchService.getSearchHistory(userId);
    return { data: history };
  }

  @Post('history')
  async saveHistory(
    @CurrentUser('id') userId: string,
    @Body() body: { query: string; resultCount?: number },
  ) {
    await this.searchService.saveSearchHistory(userId, body.query, body.resultCount);
    return { data: { success: true } };
  }

  @Delete('history/:id')
  async deleteHistory(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    await this.searchService.deleteSearchHistory(userId, id);
    return { data: { success: true } };
  }

  @Get('trending')
  async getTrending(@TenantId() tenantId: string) {
    const trending = await this.searchService.getTrendingSearches(tenantId);
    return { data: trending };
  }
}
