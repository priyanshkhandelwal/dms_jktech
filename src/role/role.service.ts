import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { UpdateRoleDto } from './dto/update-role.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoleService {
  // Inject the `drizzleProvider` to interact with the database using Drizzle ORM
  constructor(
    @Inject('drizzleProvider') private db: PostgresJsDatabase<typeof schema>,
  ) {}

  // Method to create a new role
  async create(createRoleDto: CreateRoleDto, req: Request) {
    // Insert the new role into the database and associate the `createdBy` field with the user ID from the request
    return await this.db
      .insert(schema.role) // Insert into the `role` table from the schema
      .values({ ...createRoleDto, createdBy: req['user']?.id }); // Set values from the DTO and the authenticated user's ID
  }

  // Method to retrieve all roles
  async findAll() {
    // Select all records from the `role` table
    return this.db.select({}).from(schema.role);
  }

  // Method to retrieve a single role by its ID
  async findOne(id: string) {
    // Select from the `role` table where the role ID matches the provided ID
    return await this.db
      .select({})
      .from(schema.role)
      .where(eq(schema.role.id, id));
  }

  // Method to update an existing role by its ID
  async update(id: string, updateRoleDto: UpdateRoleDto, req: Request) {
    // Update the `role` table, setting new values and updating `updatedAt` and `updatedBy` fields
    return await this.db
      .update(schema.role) // Update the `role` table
      .set({
        ...updateRoleDto, // Set the new values from the update DTO
        updatedAt: new Date(), // Set the current date for the `updatedAt` field
        updatedBy: req['user']?.id, // Set the user ID for the `updatedBy` field
      })
      .where(eq(schema.role.id, id)); // Apply the condition to match the role by its ID
  }

  // Method to delete a role by its ID
  async remove(id: string) {
    // Delete the role from the `role` table where the ID matches the provided value
    return await this.db.delete(schema.role).where(eq(schema.role.id, id));
  }
}
