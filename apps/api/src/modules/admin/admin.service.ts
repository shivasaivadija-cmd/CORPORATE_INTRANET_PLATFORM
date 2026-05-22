import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const today = startOfDay(new Date());
    const weekAgo = subDays(today, 7);

    const [employees, postsToday, recognitionsWeek, totalPosts] = await Promise.all([
      this.prisma.user.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.post.count({ where: { tenantId, createdAt: { gte: today } } }),
      this.prisma.recognition.count({ where: { tenantId, createdAt: { gte: weekAgo } } }),
      this.prisma.post.count({ where: { tenantId } }),
    ]);

    const engagement = totalPosts > 0
      ? `${Math.min(Math.round((postsToday / employees) * 100 * 10), 100)}%`
      : '0%';

    return { employees, posts: postsToday, recognitions: recognitionsWeek, engagement };
  }

  async getAuditLogs(tenantId: string, page = 1, limit = 50) {
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { tenantId },
        include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where: { tenantId } }),
    ]);
    return { data: logs, meta: { total, page, limit } };
  }

  async getTenantSettings(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, slug: true, plan: true, settings: true, primaryColor: true, logoUrl: true },
    });
  }
}
