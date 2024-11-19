import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
  // Injecting the database connection provided by drizzle
  constructor(
    @Inject('drizzleProvider') private db: PostgresJsDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  // Method to create a new user record in the database
  async create(createUserDto: CreateUserDto, req: Request) {
    const password = createUserDto?.password;
    delete createUserDto?.password;
    const hashedPassword = bcrypt.hash(password, 10);
    return this.db
      .insert(schema.users) // Insert into the 'users' table
      .values({
        ...createUserDto,
        password: hashedPassword,
        createdBy: req['user']?.id,
      }); // Include user data and the creator's ID
  }

  // Method to create a new user by admin record in the database
  async createUserByAdmin(
    createUserByAdmin: CreateUserByAdminDto,
    req: Request,
  ) {
    const password = createUserByAdmin?.password;
    delete createUserByAdmin?.password;
    const hashedPassword = bcrypt.hash(password, 10);
    return this.db
      .insert(schema.users) // Insert into the 'users' table
      .values({
        ...createUserByAdmin,
        password: hashedPassword,
        createdBy: req['user']?.id,
      }); // Include user data and the creator's ID
  }

  // Method to login a registered user by verifying details from db
  async login(loginDto: LoginDto) {
    // Step 1: Validate user credentials
    const user = this.db
      .select({
        email: schema.users.email,
        password: schema.users.password,
        id: schema.users.id,
        role: schema.role.roleName,
      })
      .from(schema.users)
      .leftJoin(schema.role, eq(schema.users.role, schema.role.id))
      .where(eq(schema.users.email, loginDto.email));
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
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Method to update an existing user by their ID
  async assignRole(id: string, assignRoleDto: AssignRoleDto, req: Request) {
    return await this.db
      .update(schema.users) // Update the 'users' table
      .set({
        ...assignRoleDto, // Set the new values from the DTO
        updatedAt: new Date(), // Set the current date for 'updatedAt'
        updatedBy: req['user']?.id, // Store the ID of the user who updated it
      })
      .where(eq(schema.users.id, id)); // Ensure that the user ID matches the provided one
  }

  // Method to retrieve all users from the database
  async findAll() {
    return this.db.select({}).from(schema.users);
  }

  // Method to retrieve a single user by their ID
  async findOne(id: string) {
    return await this.db
      .select({}) // Select all fields
      .from(schema.users) // From the 'users' table
      .where(eq(schema.users.id, id)); // Match the user's ID
  }

  // Method to update an existing user by their ID
  async update(id: string, updateUserDto: UpdateUserDto, req: Request) {
    return await this.db
      .update(schema.users) // Update the 'users' table
      .set({
        ...updateUserDto, // Set the new values from the DTO
        updatedAt: new Date(), // Set the current date for 'updatedAt'
        updatedBy: req['user']?.id, // Store the ID of the user who updated it
      })
      .where(eq(schema.users.id, id)); // Ensure that the user ID matches the provided one
  }

  // Method to delete a user by their ID
  async remove(id: string) {
    return await this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
