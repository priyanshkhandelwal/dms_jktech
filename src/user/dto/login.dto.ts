// src/auth/dto/login.dto.ts

import { ApiProperty } from '@nestjs/swagger'; // Swagger decorator for documentation
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'; // Validation decorators

/**
 * Data Transfer Object for user login
 * This class ensures the validity of login request data
 */
export class LoginDto {
  /**
   * The email address of the user
   * @example "user@example.com"
   *
   * Validation:
   * - Must be a valid email format
   * - Required field
   */
  @ApiProperty({
    description: 'The email address of the user', // Description shown in Swagger
    example: 'user@example.com', // Example value in Swagger documentation
  })
  @IsEmail({}, { message: 'Invalid email address' }) // Ensures valid email format
  email: string;

  /**
   * The password of the user
   * @example "password123"
   *
   * Validation:
   * - Must be a string
   * - Cannot be empty
   * - Minimum length of 6 characters
   */
  @ApiProperty({
    description: 'The password of the user (minimum 6 characters)', // Description shown in Swagger
    example: 'password123', // Example value in Swagger documentation
  })
  @IsString({ message: 'Password must be a string' }) // Ensures password is a string
  @IsNotEmpty({ message: 'Password is required' }) // Ensures password is not empty
  @MinLength(8, { message: 'Password must be at least 6 characters long' }) // Minimum length validation
  password: string;
}
