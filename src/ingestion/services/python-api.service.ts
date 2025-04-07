import { Injectable, Logger } from '@nestjs/common';
import { Document } from '../../documents/entities/document.entity';
import { IngestionStatus } from '../entities/ingestion-status.entity';
import { IngestionResultDto } from '../dto/ingestion-result.dto';

@Injectable()
export class PythonApiService {
  private readonly logger = new Logger(PythonApiService.name);

  // Mock method to process document through Python service
  async processDocument(document: Document): Promise<IngestionResultDto> {
    this.logger.log(`Starting mock processing for document: ${document.id}`);
    
    // Return immediate response indicating processing started
    return {
      status: IngestionStatus.PROCESSING
    };
  }

  // Mock method to check status with Python service
  async checkStatus(jobId: string): Promise<IngestionResultDto> {
    this.logger.log(`Checking mock status for job: ${jobId}`);
    
    // Simulate random success/failure (75% success rate)
    const isSuccess = Math.random() > 0.25;
    
    if (isSuccess) {
      return {
        status: IngestionStatus.COMPLETED
      };
    } else {
      return {
        status: IngestionStatus.FAILED,
        errorMessage: 'Mock processing failed due to document format issues'
      };
    }
  }
}