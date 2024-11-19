import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

/**
 * Enum representing the roles available in the system.
 * - `ADMIN`: Has full access to manage users and documents.
 * - `EDITOR`: Can edit and update content/documents.
 * - `VIEWER`: Can view content/documents but has no edit privileges.
 */
export enum Roles {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

/**
 * Data Transfer Object (DTO) for updating a user's role.
 */
export class UpdateRoleDto {
  /**
   * The name of the role to be assigned to the user.
   * - Accepts one of the predefined roles: `ADMIN`, `EDITOR`, or `VIEWER`.
   * - Validates the input using the `IsEnum` decorator to ensure it matches the `Roles` enum.
   *
   * @example Roles.ADMIN
   */
  @ApiProperty({
    description: 'Type of role. Only accepting ADMIN or EDITOR or VIEWER', // Explanation for Swagger documentation
    enum: Roles, // Indicates the possible values in Swagger
    example: Roles.ADMIN, // Example value for Swagger documentation
  })
  @IsEnum(Roles, {
    message: 'roleName must be one of the following: ADMIN, EDITOR, VIEWER', // Custom validation error message
  })
  roleName: Roles;
}
