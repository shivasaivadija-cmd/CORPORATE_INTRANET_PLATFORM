import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.department.findMany({
      where: { tenantId },
      include: {
        head: { select: { id: true, displayName: true, avatarUrl: true } },
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.department.findFirst({
      where: { id, tenantId },
      include: {
        head: { select: { id: true, displayName: true, avatarUrl: true } },
        members: {
          select: { id: true, displayName: true, avatarUrl: true, jobTitle: true },
          take: 20,
        },
        _count: { select: { members: true } },
      },
    });
  }
}
