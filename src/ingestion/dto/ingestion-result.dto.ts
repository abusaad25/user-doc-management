import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IngestionStatus } from '../entities/ingestion-status.entity';
import { ApiProperty } from '@nestjs/swagger';

export class IngestionResultDto {
  @IsEnum(IngestionStatus)
  @ApiProperty({ example: 'processing/completed', description: 'The status of the ingestion.' })
  status: IngestionStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Document not found', description: 'The error of the ingestion' })
  errorMessage?: string;
}