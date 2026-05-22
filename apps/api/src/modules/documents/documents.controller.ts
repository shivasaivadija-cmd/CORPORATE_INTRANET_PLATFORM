import {
  Controller, Get, Post, Param, Query, Body,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '@common/decorators/user.decorator';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'documents', version: '1' })
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('parentId') parentId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('type') type?: string,
  ) {
    return this.service.findAll(tenantId, { page: page ? +page : 1, limit: limit ? +limit : 30, parentId, departmentId, type });
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: any,
  ) {
    return this.service.upload(tenantId, userId, file, dto);
  }

  @Post('folder')
  createFolder(
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: { name: string; parentId?: string; departmentId?: string },
  ) {
    return this.service.createFolder(tenantId, userId, dto);
  }

  @Get(':id/download')
  getDownloadUrl(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.service.getDownloadUrl(id, tenantId);
  }
}
