import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // First name of the user, must be a non-empty string
  @ApiProperty({
    description: 'First name of the user',
    example: 'John', // Example value for Swagger documentation
  })
  @IsString() // Validate that the value is a string
  @IsNotEmpty() // Ensure that the first name is not empty
  firstName: string;

  // Last name of the user, must be a non-empty string
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe', // Example value for Swagger documentation
  })
  @IsString() // Validate that the value is a string
  @IsNotEmpty() // Ensure that the last name is not empty
  lastName: string;

  // Email address of the user, must be a valid email format and non-empty
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com', // Example value for Swagger documentation
  })
  @IsEmail() // Validate that the value is a proper email format
  @IsNotEmpty() // Ensure that the email is not empty
  email: string;

  // Password for the user, should be securely hashed in real-world applications
  @ApiProperty({
    description: 'Password of the user (should be securely hashed)',
    example: 'P@ssw0rd123', // Example value for Swagger documentation
  })
  @IsString() // Validate that the value is a string
  @IsNotEmpty() // Ensure that the password is not empty
  password: string;

  // Mobile number of the user, must be a valid phone number format
  @ApiProperty({
    description: 'Mobile number of the user',
    example: '+1234567890', // Example value for Swagger documentation
  })
  @IsPhoneNumber() // Validate that the value is a valid phone number
  @IsNotEmpty() // Ensure that the mobile number is not empty
  mobile: string;
}

export class CreateUserByAdminDto {
  // First name of the user, must be a non-empty string
  @ApiProperty({
    description: 'First name of the user',
    example: 'John', // Example value for Swagger documentation
  })
  @IsString() // Validate that the value is a string
  @IsNotEmpty() // Ensure that the first name is not empty
  firstName: string;

  // Last name of the user, must be a non-empty string
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe', // Example value for Swagger documentation
  })
  @IsString() // Validate that the value is a string
  @IsNotEmpty() // Ensure that the last name is not empty
  lastName: string;

  // Email address of the user, must be a valid email format and non-empty
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com', // Example value for Swagger documentation
  })
  @IsEmail() // Validate that the value is a proper email format
  @IsNotEmpty() // Ensure that the email is not empty
  email: string;

  // Password for the user, should be securely hashed in real-world applications
  @ApiProperty({
    description: 'Password of the user (should be securely hashed)',
    example: 'P@ssw0rd123', // Example value for Swagger documentation
  })
  @IsString() // Validate that the value is a string
  @IsNotEmpty() // Ensure that the password is not empty
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Minimum length validation
  password: string;

  // Mobile number of the user, must be a valid phone number format
  @ApiProperty({
    description: 'Mobile number of the user',
    example: '+1234567890', // Example value for Swagger documentation
  })
  @IsPhoneNumber() // Validate that the value is a valid phone number
  @IsNotEmpty() // Ensure that the mobile number is not empty
  mobile: string;

  // Role of the user, which is optional
  @ApiProperty({
    description: 'Role id of the user',
    example: 'anc688aj902hjj9c002', // Example role for Swagger documentation
    required: true, // Marked as optional in Swagger UI
  })
  @IsString() // Validate that the value is a string
  role: string; // Role is not mandatory, but can be provided
}
