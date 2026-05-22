import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '@database/prisma.service';

export interface CreateNotificationDto {
  userId: string;
  tenantId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actorId?: string;
  entityId?: string;
  entityType?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notifQueue: Queue,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId,
        type: dto.type as any,
        title: dto.title,
        body: dto.body,
        data: dto.data as any,
        actorId: dto.actorId,
        entityId: dto.entityId,
        entityType: dto.entityType,
      },
    });

    // Queue for push/email delivery
    await this.notifQueue.add('deliver', { notificationId: notification.id }, { attempts: 3, backoff: 5000 });

    return notification;
  }

  async createBulk(notifications: CreateNotificationDto[]) {
    return Promise.all(notifications.map((n) => this.create(n)));
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          // actor info via raw query for performance
        },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, unreadCount, page, limit };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }
}
