import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { IngestionService } from './services/ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { DocumentsService } from '../documents/documents.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('ingestion')
@ApiTags('ingestion')
@ApiBearerAuth()
@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly documentsService: DocumentsService,
  ) { }

  @Post('trigger')
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Trigger ingestion for a document' })
  @ApiResponse({ status: 201, description: 'Ingestion job triggered' })
  async triggerIngestion(
    @Body() createIngestionDto: CreateIngestionDto,
    @Req() req: any,
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
  @ApiOperation({ summary: 'Get status of a job' })
  @ApiResponse({ status: 200, description: 'Job status retrieved' })
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.ingestionService.getJobStatus(jobId);
  }

  @Get('document/:documentId')
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  @ApiOperation({ summary: 'Get all jobs for a document' })
  @ApiResponse({ status: 200, description: 'Document jobs retrieved' })
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async getDocumentJobs(@Param('documentId') documentId: string) {
    return this.ingestionService.getJobsForDocument(documentId);
  }
}