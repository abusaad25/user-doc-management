import {
  Controller, Get, Post, Body, Param, Put, Delete,
  UseGuards, UseInterceptors, UploadedFile, Req,
  Res, StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { User } from 'src/users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  @ApiOperation({ summary: 'Upload a document' })
  @ApiResponse({ status: 201, description: 'Document created' })
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.documentsService.create(createDocumentDto, file, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for user' })
  @ApiResponse({ status: 200, description: 'Documents retrieved' })
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  findAll(@Req() req: any) {
    return this.documentsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved' })
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.findOne(id, req.user);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a document' })
  @ApiResponse({ status: 200, description: 'Document stream returned' })
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async download(
    @Param('id') id: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { path, filename } = await this.documentsService.download(id, req.user);
    const file = createReadStream(path);

    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, description: 'Document updated' })
  @Roles(Role.ADMIN, Role.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: any,
  ) {
    return this.documentsService.update(id, updateDocumentDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.remove(id, req.user);
  }
}