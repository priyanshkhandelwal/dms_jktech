import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum Roles {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export class CreateRoleDto {
  @ApiProperty({
    description: 'Type of role. Only accepting ADMIN or EDITOR or VIEWER',
    enum: Roles,
    example: Roles.ADMIN,
  })
  @IsEnum(Roles)
  roleName: Roles;
}
