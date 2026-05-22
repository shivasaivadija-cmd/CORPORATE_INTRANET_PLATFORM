import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: { page?: number; limit?: number; status?: string; upcoming?: boolean }) {
    const { page = 1, limit = 20, status, upcoming } = query;
    const where: any = { tenantId };
    if (status) where.status = status;
    if (upcoming) where.startAt = { gte: new Date() };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          organizer: { select: { id: true, displayName: true, avatarUrl: true } },
          _count: { select: { rsvps: true } },
        },
        orderBy: { startAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data: events, meta: { total, page, limit } };
  }

  async findOne(id: string, tenantId: string, userId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, tenantId },
      include: {
        organizer: { select: { id: true, displayName: true, avatarUrl: true } },
        rsvps: {
          where: { userId },
          select: { status: true },
        },
        _count: { select: { rsvps: true } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(tenantId: string, organizerId: string, dto: any) {
    return this.prisma.event.create({
      data: {
        tenantId,
        organizerId,
        title: dto.title,
        description: dto.description,
        coverImageUrl: dto.coverImageUrl,
        location: dto.location,
        isVirtual: dto.isVirtual || false,
        meetingUrl: dto.meetingUrl,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        departmentId: dto.departmentId,
        maxAttendees: dto.maxAttendees,
        tags: dto.tags || [],
        status: 'PUBLISHED',
      },
    });
  }

  async rsvp(eventId: string, userId: string, status: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const rsvp = await this.prisma.eventRsvp.upsert({
      where: { eventId_userId: { eventId, userId } },
      create: { eventId, userId, status: status as any },
      update: { status: status as any },
    });

    // Update RSVP count
    const count = await this.prisma.eventRsvp.count({ where: { eventId, status: 'GOING' } });
    await this.prisma.event.update({ where: { id: eventId }, data: { rsvpCount: count } });

    return rsvp;
  }
}
