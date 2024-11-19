import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserByAdminDto, CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto, UpdateUserDto } from './dto/update-user.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  // Injecting the database connection and JwtService for JWT token generation
  constructor(
    @Inject('drizzleProvider') private db: PostgresJsDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new user.
   * @param createUserDto - Data Transfer Object containing user creation data.
   * @param req - HTTP request object to access user context (e.g., createdBy).
   * @returns Response with the created user data or an error if the creation fails.
   */
  async create(createUserDto: CreateUserDto, req: Request) {
    try {
      const password = createUserDto?.password;
      delete createUserDto?.password;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving

      const result = await this.db
        .insert(schema.users)
        .values({
          ...createUserDto,
          password: hashedPassword,
          createdBy: req['user']?.id, // Set the user who created the record
        })
        .returning(); // Return the inserted user details

      if (result.length === 0) {
        throw new InternalServerErrorException('Failed to create the user.');
      }

      // Return success response
      return {
        statusCode: 201,
        message: 'User created successfully',
        data: result[0],
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  /**
   * Create a new user by admin.
   * @param createUserByAdmin - Data Transfer Object containing user data to be created by admin.
   * @param req - HTTP request object to access user context (e.g., createdBy).
   * @returns Response with the created user data or an error if the creation fails.
   */
  async createUserByAdmin(
    createUserByAdmin: CreateUserByAdminDto,
    req: Request,
  ) {
    try {
      const password = createUserByAdmin?.password;
      delete createUserByAdmin?.password;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving

      const result = await this.db
        .insert(schema.users)
        .values({
          ...createUserByAdmin,
          password: hashedPassword,
          createdBy: req['user']?.id, // Set the user who created the record
        })
        .returning(); // Return the inserted user details

      if (result.length === 0) {
        throw new InternalServerErrorException('Failed to create the user.');
      }

      // Return success response
      return {
        statusCode: 201,
        message: 'User created successfully by admin',
        data: result[0],
      };
    } catch (error) {
      console.error('Error creating user by admin:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  /**
   * Login a user by verifying credentials and generating a JWT token.
   * @param loginDto - Data Transfer Object containing login credentials.
   * @returns JWT token if login is successful, otherwise throws an error.
   */
  async login(loginDto: LoginDto) {
    try {
      // Step 1: Validate user credentials
      const user = await this.db
        .select({
          email: schema.users.email,
          password: schema.users.password,
          id: schema.users.id,
          role: schema.role.roleName,
        })
        .from(schema.users)
        .leftJoin(schema.role, eq(schema.users.role, schema.role.id))
        .where(eq(schema.users.email, loginDto.email))
        .limit(1);

      // If user not found or password mismatch
      if (
        !user ||
        !(await bcrypt.compare(loginDto?.password, user[0]?.password))
      ) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Step 2: Generate and return the JWT token
      const payload = {
        email: user[0]?.email,
        id: user[0]?.id,
        role: user[0]?.role,
      };

      return {
        statusCode: 200,
        message: 'Login successful',
        data: {
          accessToken: this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
          }),
        },
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new InternalServerErrorException(
        'An error occurred while logging in.',
      );
    }
  }

  /**
   * Assign a role to an existing user by user ID.
   * @param id - The ID of the user to assign the role to.
   * @param assignRoleDto - Data Transfer Object containing role assignment details.
   * @param req - HTTP request object to access user context (e.g., updatedBy).
   * @returns Response indicating success or failure.
   */
  async assignRole(id: string, assignRoleDto: AssignRoleDto, req: Request) {
    try {
      const updated = await this.db
        .update(schema.users)
        .set({
          ...assignRoleDto,
          updatedAt: new Date(),
          updatedBy: req['user']?.id,
        })
        .where(eq(schema.users.id, id))
        .returning(); // Return the updated user details

      if (updated.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return {
        statusCode: 200,
        message: 'Role assigned successfully',
        data: updated[0],
      };
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException();
    }
  }

  /**
   * Retrieve all users.
   * @returns List of all users.
   */
  async findAll() {
    try {
      const users = await this.db.select({}).from(schema.users);

      return {
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving users.',
      );
    }
  }

  /**
   * Retrieve a single user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns User details.
   */
  async findOne(id: string) {
    try {
      const user = await this.db
        .select({})
        .from(schema.users)
        .where(eq(schema.users.id, id));

      if (user.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return {
        statusCode: 200,
        message: 'User retrieved successfully',
        data: user[0],
      };
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException();
    }
  }

  /**
   * Update an existing user's details by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing updated user data.
   * @param req - HTTP request object to access user context (e.g., updatedBy).
   * @returns Response with the updated user data.
   */
  async update(id: string, updateUserDto: UpdateUserDto, req: Request) {
    try {
      const updated = await this.db
        .update(schema.users)
        .set({
          ...updateUserDto,
          updatedAt: new Date(),
          updatedBy: req['user']?.id,
        })
        .where(eq(schema.users.id, id))
        .returning(); // Return the updated user details

      if (updated.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: updated[0],
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException();
    }
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns Response indicating success or failure.
   */
  async remove(id: string) {
    try {
      const deleted = await this.db
        .delete(schema.users)
        .where(eq(schema.users.id, id))
        .returning(); // Return the deleted user details

      if (deleted.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return {
        statusCode: 200,
        message: 'User deleted successfully',
        data: deleted[0],
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the user.',
      );
    }
  }
}
