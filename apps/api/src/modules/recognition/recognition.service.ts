import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class RecognitionService {
  constructor(private prisma: PrismaService) {}

  async give(giverId: string, tenantId: string, dto: { receiverId: string; badgeId: string; message: string; isPublic?: boolean }) {
    if (giverId === dto.receiverId) throw new BadRequestException('Cannot recognize yourself');

    const badge = await this.prisma.badge.findFirst({ where: { id: dto.badgeId, tenantId, isActive: true } });
    if (!badge) throw new BadRequestException('Invalid badge');

    const recognition = await this.prisma.recognition.create({
      data: {
        tenantId,
        giverId,
        receiverId: dto.receiverId,
        badgeId: dto.badgeId,
        message: dto.message,
        points: badge.points,
        isPublic: dto.isPublic ?? true,
      },
      include: {
        giver: { select: { id: true, displayName: true, avatarUrl: true } },
        receiver: { select: { id: true, displayName: true, avatarUrl: true } },
        badge: true,
      },
    });

    // Award points to receiver
    await this.prisma.user.update({
      where: { id: dto.receiverId },
      data: { recognitionPoints: { increment: badge.points } },
    });

    // Award badge if not already earned
    await this.prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: dto.receiverId, badgeId: dto.badgeId } },
      create: { userId: dto.receiverId, badgeId: dto.badgeId },
      update: {},
    });

    return recognition;
  }

  async findAll(tenantId: string, query: { page?: number; limit?: number; userId?: string }) {
    const { page = 1, limit = 20, userId } = query;
    const where: any = { tenantId, isPublic: true };
    if (userId) where.OR = [{ giverId: userId }, { receiverId: userId }];

    const [recognitions, total] = await Promise.all([
      this.prisma.recognition.findMany({
        where,
        include: {
          giver: { select: { id: true, displayName: true, avatarUrl: true } },
          receiver: { select: { id: true, displayName: true, avatarUrl: true } },
          badge: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.recognition.count({ where }),
    ]);

    return { data: recognitions, meta: { total, page, limit } };
  }

  async getBadges(tenantId: string) {
    return this.prisma.badge.findMany({
      where: { tenantId, isActive: true },
      orderBy: { category: 'asc' },
    });
  }
}
