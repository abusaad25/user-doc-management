import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IngestionJob } from '../../ingestion/entities/ingestion-status.entity';

export enum DocumentProcessingStatus {
  NOT_PROCESSED = 'not_processed',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({
    type: 'enum',
    enum: DocumentProcessingStatus,
    default: DocumentProcessingStatus.NOT_PROCESSED,
  })
  processingStatus: DocumentProcessingStatus;

  @ManyToOne(() => User, user => user.documents)
  owner: User;

  @OneToMany(() => IngestionJob, job => job.document)
  ingestionJobs: IngestionJob[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}