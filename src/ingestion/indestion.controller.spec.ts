import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './services/ingestion.service';
import { DocumentsService } from '../documents/documents.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionService: Partial<IngestionService>;

  beforeEach(async () => {
    ingestionService = {
      triggerIngestion: jest.fn().mockResolvedValue({
        id: 'job123',
        status: 'PENDING',
        createdAt: new Date(),
      }),
      getJobStatus: jest.fn().mockResolvedValue({ status: 'PENDING' }),
      getJobsForDocument: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        { provide: IngestionService, useValue: ingestionService },
        {
          provide: DocumentsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 'doc123' }),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
  });

  it('should trigger ingestion and return job info', async () => {
    const req = { user: { id: 'user123' } } as any;
    const dto = { documentId: 'doc123' };

    const result = await controller.triggerIngestion(dto, req);
    expect(result.jobId).toBe('job123');
  });

  it('should return job status', async () => {
    const result = await controller.getJobStatus('job123');
    expect(result.status).toBe('PENDING');
  });
});
