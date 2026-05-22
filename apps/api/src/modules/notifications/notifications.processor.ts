import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('deliver')
  async handleDeliver(job: Job<{ notificationId: string }>) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: job.data.notificationId },
      include: { user: { include: { notificationPrefs: true } } },
    });

    if (!notification) return;

    const prefs = notification.user.notificationPrefs;

    // Push notification delivery (FCM/APNs integration point)
    if (prefs?.pushEnabled) {
      this.logger.log(`Push notification queued for user ${notification.userId}`);
      // TODO: Integrate with FCM/APNs
    }

    // Email digest (batch, not immediate)
    if (prefs?.emailEnabled && prefs?.digestEnabled) {
      this.logger.log(`Email digest queued for user ${notification.userId}`);
      // TODO: Integrate with email service (SES/SendGrid)
    }
  }
}
