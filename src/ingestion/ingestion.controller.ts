import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { IngestionService } from './services/ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { DocumentsService } from '../documents/documents.service';
import { Request } from 'express';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly documentsService: DocumentsService,
  ) { }

  @Post('trigger')
  @Roles(Role.ADMIN, Role.EDITOR)
  async triggerIngestion(
    @Body() createIngestionDto: CreateIngestionDto,
    @Req() req: Request,
  ) {
    // First, get the document
    const document = await this.documentsService.findOne(
      createIngestionDto.documentId,
      req.user
    );

    // Then, trigger ingestion
    const job = await this.ingestionService.triggerIngestion(document, req.user);

    return {
      jobId: job.id,
      documentId: document.id,
      status: job.status,
      createdAt: job.createdAt,
    };
  }

  @Get('status/:jobId')
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.ingestionService.getJobStatus(jobId);
  }

  @Get('document/:documentId')
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async getDocumentJobs(@Param('documentId') documentId: string) {
    return this.ingestionService.getJobsForDocument(documentId);
  }
}