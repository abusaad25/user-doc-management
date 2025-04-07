import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IngestionStatus } from '../entities/ingestion-status.entity';

export class IngestionResultDto {
  @IsEnum(IngestionStatus)
  status: IngestionStatus;
  
  @IsString()
  @IsOptional()
  errorMessage?: string;
}