import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { FeedService } from './feed.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FeedQueryDto } from './dto/feed-query.dto';

@ApiTags('Feed')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'feed', version: '1' })
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  @ApiOperation({ summary: 'Get personalized feed' })
  getFeed(
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
    @Query() query: FeedQueryDto,
  ) {
    return this.feedService.getFeed(userId, tenantId, query);
  }

  @Post('posts')
  @ApiOperation({ summary: 'Create post' })
  createPost(
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.feedService.createPost(userId, tenantId, dto);
  }

  @Get('posts/:id')
  getPost(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
  ) {
    return this.feedService.getPost(postId, userId, tenantId);
  }

  @Delete('posts/:id')
  @HttpCode(HttpStatus.OK)
  deletePost(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
  ) {
    return this.feedService.deletePost(postId, userId, tenantId);
  }

  @Post('posts/:id/react')
  @HttpCode(HttpStatus.OK)
  reactToPost(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
    @Body('type') type: string,
  ) {
    return this.feedService.reactToPost(postId, userId, tenantId, type);
  }

  @Post('posts/:id/bookmark')
  @HttpCode(HttpStatus.OK)
  toggleBookmark(@Param('id') postId: string, @CurrentUser('id') userId: string) {
    return this.feedService.toggleBookmark(postId, userId);
  }

  @Get('posts/:id/comments')
  getComments(@Param('id') postId: string, @CurrentUser('id') userId: string) {
    return this.feedService.getComments(postId, userId);
  }

  @Post('posts/:id/comments')
  createComment(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { content: string; parentId?: string },
  ) {
    return this.feedService.createComment(postId, userId, body.content, body.parentId);
  }
}
