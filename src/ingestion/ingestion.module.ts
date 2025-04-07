import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { IngestionJob } from './entities/ingestion-status.entity';
import { IngestionService } from './services/ingestion.service';
import { PythonApiService } from './services/python-api.service';
import { IngestionController } from './controllers/ingestion.controller';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestionJob]),
    ScheduleModule.forRoot(),
    DocumentsModule,
  ],
  controllers: [IngestionController],
  providers: [IngestionService, PythonApiService],
  exports: [IngestionService],
})
export class IngestionModule {}