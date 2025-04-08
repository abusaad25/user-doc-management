import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  const mockUser = { id: 'user123', role: 'admin' };
  const mockDocumentsService = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue(['doc1', 'doc2']),
    findOne: jest.fn().mockResolvedValue('doc1'),
    download: jest.fn().mockResolvedValue({ path: './file.txt', filename: 'file.txt' }),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [{ provide: DocumentsService, useValue: mockDocumentsService }],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('should get all documents', async () => {
    const result = await controller.findAll({ user: mockUser } as any);
    expect(result).toEqual(['doc1', 'doc2']);
    expect(mockDocumentsService.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should get a specific document', async () => {
    const result = await controller.findOne('doc1', { user: mockUser } as any);
    expect(result).toEqual('doc1');
    expect(mockDocumentsService.findOne).toHaveBeenCalledWith('doc1', mockUser);
  });

  it('should create a document', async () => {
    const dto = { title: 'test' };
    const file = { originalname: 'file.txt' } as any;
    await controller.create(dto as any, file, { user: mockUser } as any);
    expect(mockDocumentsService.create).toHaveBeenCalledWith(dto, file, mockUser);
  });

  it('should update a document', async () => {
    const dto = { title: 'updated' };
    await controller.update('docId', dto as any, { user: mockUser } as any);
    expect(mockDocumentsService.update).toHaveBeenCalledWith('docId', dto, mockUser);
  });

  it('should delete a document', async () => {
    await controller.remove('docId', { user: mockUser } as any);
    expect(mockDocumentsService.remove).toHaveBeenCalledWith('docId', mockUser);
  });

  it('should call download with document ID and user', async () => {
    const mockRes: any = {
      set: jest.fn(),
    };
    const result = await controller.download('docId', { user: mockUser } as any, mockRes);
    expect(mockDocumentsService.download).toHaveBeenCalledWith('docId', mockUser);
    expect(mockRes.set).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
