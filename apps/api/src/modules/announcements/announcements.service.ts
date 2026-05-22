import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AiService } from '@modules/ai/ai.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async findAll(tenantId: string, query: { limit?: number; pinned?: boolean; page?: number }) {
    const { limit = 20, pinned, page = 1 } = query;
    const where: any = { tenantId, publishedAt: { lte: new Date() } };
    if (pinned !== undefined) where.isPinned = pinned;

    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        include: { author: { select: { id: true, displayName: true, avatarUrl: true, jobTitle: true } } },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return { data: announcements, meta: { total, page, limit } };
  }

  async findOne(id: string, tenantId: string, userId: string) {
    const ann = await this.prisma.announcement.findFirst({
      where: { id, tenantId },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
        reads: { where: { userId }, select: { hasAcknowledged: true, readAt: true } },
      },
    });
    if (!ann) throw new NotFoundException('Announcement not found');

    // Mark as read
    await this.prisma.announcementRead.upsert({
      where: { announcementId_userId: { announcementId: id, userId } },
      create: { announcementId: id, userId },
      update: { readAt: new Date() },
    });

    return ann;
  }

  async create(tenantId: string, authorId: string, dto: any) {
    const ann = await this.prisma.announcement.create({
      data: {
        tenantId,
        authorId,
        title: dto.title,
        content: dto.content,
        richContent: dto.richContent,
        priority: dto.priority || 'MEDIUM',
        audience: dto.audience || 'ALL',
        isPinned: dto.isPinned || false,
        requiresAck: dto.requiresAck || false,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        publishedAt: dto.scheduledAt ? null : new Date(),
      },
    });

    // AI summary
    const aiSummary = await this.aiService.summarizeContent(dto.content, 40);
    if (aiSummary) {
      await this.prisma.announcement.update({ where: { id: ann.id }, data: { aiSummary } });
    }

    return ann;
  }

  async acknowledge(id: string, userId: string) {
    await this.prisma.announcementRead.upsert({
      where: { announcementId_userId: { announcementId: id, userId } },
      create: { announcementId: id, userId, hasAcknowledged: true, acknowledgedAt: new Date() },
      update: { hasAcknowledged: true, acknowledgedAt: new Date() },
    });

    await this.prisma.announcement.update({
      where: { id },
      data: { ackCount: { increment: 1 } },
    });

    return { acknowledged: true };
  }
}
