import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async getPosts(tenantId: string, filter?: string) {
    const where: any = { tenantId, isDeleted: false };

    if (filter === 'flagged') {
      where.isModerated = true;
    } else if (filter === 'toxic') {
      where.aiToxicityScore = { gt: 0.7 };
    }

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            jobTitle: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { data: posts };
  }

  async approvePost(postId: string, tenantId: string) {
    const post = await this.prisma.post.findFirst({ where: { id: postId, tenantId } });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.update({
      where: { id: postId },
      data: { isModerated: false },
    });

    return { message: 'Post approved' };
  }

  async deletePost(postId: string, tenantId: string) {
    const post = await this.prisma.post.findFirst({ where: { id: postId, tenantId } });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true },
    });

    return { message: 'Post deleted' };
  }
}
