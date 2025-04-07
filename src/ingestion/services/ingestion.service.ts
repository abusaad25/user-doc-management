import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IngestionJob, IngestionStatus } from '../entities/ingestion-status.entity';
import { PythonApiService } from './python-api.service';
import { Document, DocumentProcessingStatus } from '../../documents/entities/document.entity';
import { DocumentsService } from '../../documents/documents.service';

@Injectable()
export class IngestionService {
    private readonly logger = new Logger(IngestionService.name);
    private readonly MAX_RETRY_COUNT = 3;

    constructor(
        @InjectRepository(IngestionJob)
        private ingestionRepository: Repository<IngestionJob>,
        private pythonApiService: PythonApiService,
        private documentsService: DocumentsService,
    ) { }

    async triggerIngestion(document: Document, user: any): Promise<IngestionJob> {
        // Create new ingestion job
        const ingestionJob = this.ingestionRepository.create({
            document,
            status: IngestionStatus.PENDING,
            retryCount: 0,
        });

        // Save the job to get ID
        const savedJob = await this.ingestionRepository.save(ingestionJob);

        // Update document status to reflect pending ingestion
        await this.updateDocumentStatus(savedJob);

        // Start processing asynchronously
        this.processIngestion(savedJob);

        return savedJob;
    }

    private async processIngestion(job: IngestionJob): Promise<void> {
        try {
            // Update status to processing
            job.status = IngestionStatus.PROCESSING;
            await this.ingestionRepository.save(job);

            // Update document status to processing
            await this.updateDocumentStatus(job);

            // Call the Python API (mocked)
            const processResponse = await this.pythonApiService.processDocument(job.document);

            // Simulate async processing (in a real app, we'd wait for a callback or poll)
            setTimeout(async () => {
                try {
                    // Check status with Python service
                    const result = await this.pythonApiService.checkStatus(job.id);

                    // Update job with result
                    job.status = result.status;
                    job.errorMessage = result.errorMessage ?? "";

                    if (job.status === IngestionStatus.COMPLETED) {
                        job.completedAt = new Date();
                    }

                    await this.ingestionRepository.save(job);

                    // Update document status based on job status
                    await this.updateDocumentStatus(job);
                } catch (error) {
                    this.logger.error(`Error checking ingestion status: ${error.message}`);
                    await this.handleIngestionError(job, error.message);
                }
            }, 5000); // Simulate 5 second processing time

        } catch (error) {
            this.logger.error(`Error triggering ingestion: ${error.message}`);
            await this.handleIngestionError(job, error.message);
        }
    }

    private async handleIngestionError(job: IngestionJob, errorMessage: string): Promise<void> {
        job.errorMessage = errorMessage;

        // Check if we should retry
        if (job.retryCount < this.MAX_RETRY_COUNT) {
            job.retryCount += 1;
            job.status = IngestionStatus.PENDING;
            await this.ingestionRepository.save(job);

            // Update document status to pending (for retry)
            await this.updateDocumentStatus(job);

            this.logger.log(`Scheduling retry ${job.retryCount} for job ${job.id}`);

            // Retry after a delay (exponential backoff)
            setTimeout(() => {
                this.processIngestion(job);
            }, 1000 * Math.pow(2, job.retryCount));
        } else {
            // Mark as failed if max retries reached
            job.status = IngestionStatus.FAILED;
            await this.ingestionRepository.save(job);

            // Update document status to failed
            await this.updateDocumentStatus(job);
        }
    }

    private async updateDocumentStatus(job: IngestionJob): Promise<void> {
        // Get document processing status based on job status
        let processingStatus: DocumentProcessingStatus;

        switch (job.status) {
            case IngestionStatus.PENDING:
            case IngestionStatus.PROCESSING:
                processingStatus = DocumentProcessingStatus.PROCESSING;
                break;
            case IngestionStatus.COMPLETED:
                processingStatus = DocumentProcessingStatus.PROCESSED;
                break;
            case IngestionStatus.FAILED:
                processingStatus = DocumentProcessingStatus.FAILED;
                break;
            default:
                processingStatus = DocumentProcessingStatus.NOT_PROCESSED;
        }

        // Update the document status
        await this.documentsService.updateDocumentProcessingStatus(
            job.document.id,
            processingStatus
        );
    }

    async getJobStatus(jobId: string): Promise<IngestionJob> {
        const job = await this.ingestionRepository.findOne({ where: { id: jobId } });

        if (!job) {
            throw new NotFoundException(`Ingestion job with ID ${jobId} not found`);
        }

        return job;
    }

    async getJobsForDocument(documentId: string): Promise<IngestionJob[]> {
        return this.ingestionRepository.find({
            where: { document: { id: documentId } },
            order: { createdAt: 'DESC' },
        });
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async processStuckJobs() {
        // Find jobs stuck in PROCESSING for more than 10 minutes
        const tenMinutesAgo = new Date();
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

        const stuckJobs = await this.ingestionRepository.find({
            where: {
                status: IngestionStatus.PROCESSING,
                updatedAt: tenMinutesAgo
            }
        });

        for (const job of stuckJobs) {
            this.logger.log(`Found stuck job ${job.id}, attempting recovery`);
            await this.handleIngestionError(job, 'Processing timeout');
        }
    }
}