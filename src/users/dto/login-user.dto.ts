import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'abusaad.dev3@gmail.com', description: 'The email of the user' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0dc0f65c-a7d8-4cf5-b9d7-d55c6c70fdbf', description: 'The password of the user' })
  password: string;
}