import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  avatarUrl: true,
  coverUrl: true,
  role: true,
  status: true,
  jobTitle: true,
  bio: true,
  location: true,
  timezone: true,
  skills: true,
  socialLinks: true,
  recognitionPoints: true,
  lastSeenAt: true,
  createdAt: true,
  department: { select: { id: true, name: true, color: true } },
  manager: { select: { id: true, displayName: true, avatarUrl: true } },
  _count: { select: { recognitionsReceived: true, posts: true } },
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(tenantId: string, query: { page?: number; limit?: number; search?: string; departmentId?: string }) {
    const { page = 1, limit = 20, search, departmentId } = query;
    const where: any = { tenantId, status: 'ACTIVE' };

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (departmentId) where.departmentId = departmentId;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: { displayName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateProfile(userId: string, dto: Partial<{
    firstName: string; lastName: string; jobTitle: string;
    bio: string; location: string; timezone: string;
    skills: string[]; socialLinks: Record<string, string>;
    avatarUrl: string; coverUrl: string;
  }>) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        displayName: dto.firstName && dto.lastName
          ? `${dto.firstName} ${dto.lastName}`
          : undefined,
      },
      select: USER_SELECT,
    });
    return updated;
  }

  async getOrgChart(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId, status: 'ACTIVE' },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        jobTitle: true,
        managerId: true,
        departmentId: true,
        department: { select: { name: true, color: true } },
      },
    });
    return users;
  }

  async getLeaderboard(tenantId: string, limit = 10) {
    return this.prisma.user.findMany({
      where: { tenantId, status: 'ACTIVE' },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        jobTitle: true,
        recognitionPoints: true,
        department: { select: { name: true } },
      },
      orderBy: { recognitionPoints: 'desc' },
      take: limit,
    });
  }
}
