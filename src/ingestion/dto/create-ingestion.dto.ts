import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateIngestionDto {
  @IsUUID()
  @IsNotEmpty()
  documentId: string;
}