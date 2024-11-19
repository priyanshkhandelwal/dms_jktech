import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoleService {
  // Injecting Drizzle ORM's database instance for PostgreSQL
  constructor(
    @Inject('drizzleProvider') private db: PostgresJsDatabase<typeof schema>,
  ) {}

  /**
   * Create a new role.
   * @param createRoleDto - Data Transfer Object containing role creation data.
   * @param req - HTTP request object to access user context (e.g., createdBy).
   * @returns Created role data or throws an error if the operation fails.
   */
  async create(createRoleDto: CreateRoleDto, req: Request) {
    try {
      // Insert the new role into the database
      const result = await this.db
        .insert(schema.role)
        .values({ ...createRoleDto, createdBy: req['user']?.id })
        .returning(); // Return the inserted role details

      // Ensure at least one record was created
      if (result.length === 0) {
        throw new InternalServerErrorException('Failed to create the role.');
      }

      // Return success response
      return {
        statusCode: 201,
        message: 'Role created successfully',
        data: result[0],
      };
    } catch (error) {
      console.error('Error creating role:', error);
      // Handle unexpected errors
      throw new InternalServerErrorException(
        'An error occurred while creating the role.',
      );
    }
  }

  /**
   * Retrieve all roles.
   * @returns List of roles or throws an error if the operation fails.
   */
  async findAll() {
    try {
      // Fetch all roles from the database
      const roles = await this.db.select().from(schema.role);

      // Return success response
      return {
        statusCode: 200,
        message: 'Roles retrieved successfully',
        data: roles,
      };
    } catch (error) {
      console.error('Error retrieving roles:', error);
      // Handle unexpected errors
      throw new InternalServerErrorException(
        'An error occurred while retrieving roles.',
      );
    }
  }

  /**
   * Retrieve a single role by ID.
   * @param id - Unique identifier of the role.
   * @returns Role details or throws an error if not found or operation fails.
   */
  async findOne(id: string) {
    try {
      // Fetch the role matching the provided ID
      const role = await this.db
        .select()
        .from(schema.role)
        .where(eq(schema.role.id, id))
        .limit(1);

      // Check if the role exists
      if (role.length === 0) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }

      // Return success response
      return {
        statusCode: 200,
        message: 'Role retrieved successfully',
        data: role[0],
      };
    } catch (error) {
      console.error('Error retrieving role:', error);
      // Handle specific or unexpected errors
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException();
    }
  }

  /**
   * Update an existing role by ID.
   * @param id - Unique identifier of the role.
   * @param updateRoleDto - Data Transfer Object containing updated role data.
   * @param req - HTTP request object to access user context (e.g., updatedBy).
   * @returns Updated role data or throws an error if the operation fails.
   */
  async update(id: string, updateRoleDto: UpdateRoleDto, req: Request) {
    try {
      // Update the role in the database
      const updated = await this.db
        .update(schema.role)
        .set({
          ...updateRoleDto, // Merge new data with existing fields
          updatedAt: new Date(), // Record the current timestamp
          updatedBy: req['user']?.id, // Set the user who performed the update
        })
        .where(eq(schema.role.id, id)) // Identify the role to update
        .returning(); // Return the updated role details

      // Check if the role was updated
      if (updated.length === 0) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }

      // Return success response
      return {
        statusCode: 200,
        message: 'Role updated successfully',
        data: updated[0],
      };
    } catch (error) {
      console.error('Error updating role:', error);
      // Handle specific or unexpected errors
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException();
    }
  }

  /**
   * Delete a role by ID.
   * @param id - Unique identifier of the role.
   * @returns Deletion result or throws an error if the operation fails.
   */
  async remove(id: string) {
    try {
      // Delete the role from the database
      const deleted = await this.db
        .delete(schema.role)
        .where(eq(schema.role.id, id))
        .returning(); // Return the deleted role details

      // Check if the role was deleted
      if (deleted.length === 0) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }

      // Return success response
      return {
        statusCode: 200,
        message: 'Role deleted successfully',
        data: deleted[0],
      };
    } catch (error) {
      console.error('Error deleting role:', error);
      // Handle specific or unexpected errors
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException();
    }
  }
}
