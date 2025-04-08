import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Document, DocumentProcessingStatus } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) { }

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Document> {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      owner: user,
    });

    return this.documentsRepository.save(document);
  }

  async findAll(user: User): Promise<Document[]> {
    // Admins can see all documents, others can only see their own
    if (user.role === Role.ADMIN) {
      return this.documentsRepository.find({ relations: ['owner'] });
    }

    return this.documentsRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner'],
    });
  }

  async findOne(id: string, user: User): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Check user authorization - admin can access any document, 
    // others can only access their own documents
    if (user.role !== Role.ADMIN && document.owner.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return document;
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: User,
  ): Promise<Document> {
    const document = await this.findOne(id, user);

    // Additional check for editors
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers can only view documents');
    }

    // Update document with new data
    const updatedDocument = {
      ...document,
      ...updateDocumentDto,
    };

    return this.documentsRepository.save(updatedDocument);
  }

  async remove(id: string, user: User): Promise<void> {
    const document = await this.findOne(id, user);

    // Only admins or document owners can delete
    if (user.role !== Role.ADMIN && document.owner.id !== user.id) {
      throw new ForbiddenException('You cannot delete this document');
    }

    // Delete file from filesystem
    try {
      fs.unlinkSync(document.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.documentsRepository.remove(document);
  }

  async download(id: string, user: User): Promise<{ path: string, filename: string }> {
    const document = await this.findOne(id, user);

    return {
      path: document.filePath,
      filename: document.fileName
    };
  }

  async updateDocumentProcessingStatus(id: string, status: DocumentProcessingStatus): Promise<Document> {
    const document = await this.documentsRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.processingStatus = status;
    return this.documentsRepository.save(document);
  }
}