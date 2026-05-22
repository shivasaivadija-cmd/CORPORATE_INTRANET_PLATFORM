import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { StorageService } from './storage.service';
import { AiService } from '@modules/ai/ai.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private aiService: AiService,
  ) {}

  async findAll(tenantId: string, query: { page?: number; limit?: number; parentId?: string; departmentId?: string; type?: string }) {
    const { page = 1, limit = 30, parentId, departmentId, type } = query;
    const where: any = { tenantId };
    where.parentId = parentId || null;
    if (departmentId) where.departmentId = departmentId;
    if (type) {
      const types = type.split(',').map(t => t.trim());
      const mimeTypes: string[] = [];
      types.forEach(t => {
        if (t === 'image') mimeTypes.push('image/');
        if (t === 'video') mimeTypes.push('video/');
        if (t === 'pdf') mimeTypes.push('application/pdf');
        if (t === 'document') mimeTypes.push('application/msword', 'application/vnd.openxmlformats-officedocument');
      });
      if (mimeTypes.length) {
        where.OR = mimeTypes.map(mt => ({ mimeType: { startsWith: mt } }));
      }
    }

    const [docs, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: {
          uploader: { select: { id: true, displayName: true, avatarUrl: true } },
        },
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.document.count({ where }),
    ]);

    return { data: docs, meta: { total, page, limit } };
  }

  async upload(tenantId: string, uploaderId: string, file: Express.Multer.File, dto: any) {
    const { key, url } = await this.storage.upload(file, `tenants/${tenantId}/documents`);

    const doc = await this.prisma.document.create({
      data: {
        tenantId,
        uploaderId,
        name: dto.name || file.originalname,
        type: 'FILE',
        mimeType: file.mimetype,
        size: BigInt(file.size),
        storageKey: key,
        url,
        parentId: dto.parentId || null,
        departmentId: dto.departmentId || null,
        tags: dto.tags || [],
        isPublic: dto.isPublic === 'true',
      },
    });

    // AI tagging (async, non-blocking)
    this.aiService.generateTags(file.originalname).then(async (aiTags) => {
      if (aiTags.length) {
        await this.prisma.document.update({ where: { id: doc.id }, data: { aiTags } });
      }
    });

    return doc;
  }

  async createFolder(tenantId: string, uploaderId: string, dto: { name: string; parentId?: string; departmentId?: string }) {
    return this.prisma.document.create({
      data: {
        tenantId,
        uploaderId,
        name: dto.name,
        type: 'FOLDER',
        parentId: dto.parentId || null,
        departmentId: dto.departmentId || null,
      },
    });
  }

  async getDownloadUrl(id: string, tenantId: string) {
    const doc = await this.prisma.document.findFirst({ where: { id, tenantId } });
    if (!doc || !doc.storageKey) throw new NotFoundException('Document not found');

    await this.prisma.document.update({ where: { id }, data: { downloadCount: { increment: 1 } } });
    const url = await this.storage.getPresignedUrl(doc.storageKey);
    return { url };
  }
}
