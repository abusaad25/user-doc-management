import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myDocument', description: 'An important .ppt document.' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This doc is used weekly in my Office to give updates.', description: 'The desc of the document' })
  description?: string;
}