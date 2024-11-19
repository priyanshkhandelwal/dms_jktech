import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  /**
   * First name of the user (optional)
   */
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false, // Marked as optional for Swagger documentation
  })
  @IsOptional() // Field is optional
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  firstName?: string;

  /**
   * Last name of the user (optional)
   */
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false, // Marked as optional for Swagger documentation
  })
  @IsOptional() // Field is optional
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  lastName?: string;

  /**
   * Email address of the user (optional)
   */
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: false, // Marked as optional for Swagger documentation
  })
  @IsOptional() // Field is optional
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email?: string;

  /**
   * Password for the user (optional)
   */
  @ApiProperty({
    description: 'Password of the user (should be securely hashed)',
    example: 'P@ssw0rd123',
    required: false, // Marked as optional for Swagger documentation
  })
  @IsOptional() // Field is optional
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  /**
   * Mobile number of the user (optional)
   */
  @ApiProperty({
    description: 'Mobile number of the user',
    example: '+1234567890',
    required: false, // Marked as optional for Swagger documentation
  })
  @IsOptional() // Field is optional
  @IsPhoneNumber(null, { message: 'Mobile number must be valid' })
  @IsNotEmpty({ message: 'Mobile number cannot be empty' })
  mobile?: string;

  /**
   * Role of the user (optional)
   */
  @ApiProperty({
    description: 'Role id of the user',
    example: 'anc688aj902hjj9c002',
    required: false, // Marked as optional for Swagger documentation
  })
  @IsOptional() // Field is optional
  @IsString({ message: 'Role must be a string' })
  role?: string;
}

export class AssignRoleDto {
  // Role of the user, which is optional
  @ApiProperty({
    description: 'Role id of the user',
    example: 'anc688aj902hjj9c002', // Example role for Swagger documentation
    required: true, // Marked as optional in Swagger UI
  })
  @IsString() // Validate that the value is a string
  role: string; // Role is not mandatory, but can be provided
}
