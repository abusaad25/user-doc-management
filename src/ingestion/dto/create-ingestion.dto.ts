import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateIngestionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '0dc0f65c-a7d8-4cf5-b9d7-d55c6c70fdbf', description: 'The ID of the document' })
  documentId: string;
}