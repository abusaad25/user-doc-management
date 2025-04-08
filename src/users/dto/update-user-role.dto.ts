import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../entities/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({ example: 'Viewer/Editor/Admin', description: 'The role of the user' })
  role: Role;
}