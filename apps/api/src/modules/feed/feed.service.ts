import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PostType, PostVisibility } from '@prisma/client';
import { PrismaService } from '@database/prisma.service';
import { AiService } from '@modules/ai/ai.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { FeedRankingService } from './feed-ranking.service';

const POST_SELECT = {
  id: true,
  type: true,
  visibility: true,
  content: true,
  richContent: true,
  mediaUrls: true,
  hashtags: true,
  mentions: true,
  isPinned: true,
  aiSummary: true,
  viewCount: true,
  commentCount: true,
  bookmarkCount: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      jobTitle: true,
      department: { select: { id: true, name: true } },
    },
  },
  reactions: { select: { type: true, userId: true } },
  poll: { include: { options: { include: { votes: { select: { userId: true } } } } } },
  _count: { select: { comments: true } },
};

@Injectable()
export class FeedService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private rankingService: FeedRankingService,
    @InjectQueue('feed') private feedQueue: Queue,
  ) {}

  async createPost(userId: string, tenantId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        tenantId,
        authorId: userId,
        type: (dto.type as PostType) || PostType.TEXT,
        visibility: (dto.visibility as PostVisibility) || PostVisibility.PUBLIC,
        content: dto.content,
        richContent: dto.richContent as any,
        mediaUrls: dto.mediaUrls || [],
        hashtags: this.extractHashtags(dto.content),
        mentions: dto.mentions || [],
        departmentId: dto.departmentId,
        publishedAt: new Date(),
        ...(dto.poll && {
          poll: {
            create: {
              question: dto.poll.question,
              allowMultiple: dto.poll.allowMultiple || false,
              endsAt: new Date(dto.poll.endsAt),
              options: { create: dto.poll.options.map((o) => ({ text: o })) },
            },
          },
        }),
      },
      select: POST_SELECT,
    });

    // Queue AI processing
    await this.feedQueue.add('process-post', { postId: post.id, content: dto.content }, { delay: 1000 });

    return this.formatPost(post, userId);
  }

  async getFeed(userId: string, tenantId: string, query: FeedQueryDto) {
    const { page = 1, limit = 20, type, departmentId } = query;
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { departmentId: true },
    });

    const where: any = {
      tenantId,
      isDeleted: false,
      publishedAt: { lte: new Date() },
      OR: [
        { visibility: 'PUBLIC' },
        { visibility: 'DEPARTMENT', departmentId: user?.departmentId },
        { authorId: userId },
      ],
    };

    if (type) where.type = type;
    if (departmentId) where.departmentId = departmentId;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        select: POST_SELECT,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    const ranked = this.rankingService.rank(posts, userId);
    return {
      data: ranked.map((p) => this.formatPost(p, userId)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPost(postId: string, userId: string, tenantId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, tenantId },
      select: POST_SELECT,
    });
    if (!post) throw new NotFoundException('Post not found');

    // Increment view count
    await this.prisma.post.update({ where: { id: postId }, data: { viewCount: { increment: 1 } } });

    return this.formatPost(post, userId);
  }

  async reactToPost(postId: string, userId: string, tenantId: string, reactionType: string) {
    const post = await this.prisma.post.findFirst({ where: { id: postId, tenantId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.reaction.findFirst({
      where: { postId, userId, type: reactionType as any },
    });

    if (existing) {
      await this.prisma.reaction.delete({ where: { id: existing.id } });
      return { action: 'removed', type: reactionType };
    }

    await this.prisma.reaction.create({
      data: { postId, userId, type: reactionType as any },
    });

    return { action: 'added', type: reactionType };
  }

  async deletePost(postId: string, userId: string, tenantId: string) {
    const post = await this.prisma.post.findFirst({ where: { id: postId, tenantId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Cannot delete this post');

    await this.prisma.post.update({ where: { id: postId }, data: { isDeleted: true } });
    return { message: 'Post deleted' };
  }

  async toggleBookmark(postId: string, userId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      await this.prisma.post.update({ where: { id: postId }, data: { bookmarkCount: { decrement: 1 } } });
      return { bookmarked: false };
    }

    await this.prisma.bookmark.create({ data: { userId, postId } });
    await this.prisma.post.update({ where: { id: postId }, data: { bookmarkCount: { increment: 1 } } });
    return { bookmarked: true };
  }

  async getComments(postId: string, userId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { postId, parentId: null, isDeleted: false },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true, jobTitle: true } },
        reactions: { select: { type: true, userId: true } },
        replies: {
          where: { isDeleted: false },
          include: {
            author: { select: { id: true, displayName: true, avatarUrl: true } },
            reactions: { select: { type: true, userId: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((c) => this.formatComment(c, userId));
  }

  async createComment(postId: string, userId: string, content: string, parentId?: string) {
    const comment = await this.prisma.comment.create({
      data: { postId, authorId: userId, content, parentId },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true, jobTitle: true } },
      },
    });

    await this.prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  private extractHashtags(content: string): string[] {
    const matches = content.match(/#[\w]+/g) || [];
    return [...new Set(matches.map((h) => h.toLowerCase()))];
  }

  private formatPost(post: any, currentUserId: string) {
    const reactionCounts = post.reactions.reduce(
      (acc: any, r: any) => {
        acc[r.type.toLowerCase()] = (acc[r.type.toLowerCase()] || 0) + 1;
        return acc;
      },
      { like: 0, love: 0, celebrate: 0, insightful: 0, curious: 0 },
    );

    const userReaction = post.reactions.find((r: any) => r.userId === currentUserId)?.type || null;

    return {
      ...post,
      reactions: undefined,
      reactionCounts,
      userReaction,
      commentCount: post._count?.comments ?? post.commentCount,
      _count: undefined,
    };
  }

  private formatComment(comment: any, currentUserId: string) {
    const reactionCounts = comment.reactions.reduce(
      (acc: any, r: any) => {
        acc[r.type.toLowerCase()] = (acc[r.type.toLowerCase()] || 0) + 1;
        return acc;
      },
      { like: 0, love: 0, celebrate: 0, insightful: 0, curious: 0 },
    );

    return {
      ...comment,
      reactions: undefined,
      reactionCounts,
      userReaction: comment.reactions.find((r: any) => r.userId === currentUserId)?.type || null,
      replies: comment.replies?.map((r: any) => this.formatComment(r, currentUserId)),
    };
  }
}
