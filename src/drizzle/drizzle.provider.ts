// Import the `drizzle` ORM for Node.js PostgreSQL, which provides a seamless way to interact with the database
import { drizzle } from 'drizzle-orm/node-postgres';

// Import the `Pool` class from the `pg` package for managing a pool of connections to the PostgreSQL database
import { Pool } from 'pg';

// Import the database schema definitions from the local `schema` file
import * as schema from './schema';

// Import `ConfigService` from NestJS to access application configuration settings
import { ConfigService } from '@nestjs/config';

// Import the type for `NodePgDatabase` provided by `drizzle-orm` for strong type safety
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

// Define a provider for dependency injection in NestJS
export const drizzleProvider = {
  // Specify the provider's name, which can be injected elsewhere in the application using this token
  provide: 'drizzleProvider',

  // Declare dependencies to be injected, in this case, `ConfigService`
  inject: [ConfigService],

  // Define a factory function to create the `drizzle` instance with the necessary configuration
  useFactory: async (configService: ConfigService) => {
    // Fetch the database connection string from the environment configuration
    const connectionString = configService.get<string>('DATABASE_URL');

    // Create a new PostgreSQL connection pool with the fetched connection string
    const pool = new Pool({
      connectionString,
    });

    // Return an instance of the `drizzle` ORM with the connection pool and schema,
    // enabling schema-based database operations and logging for debugging purposes
    return drizzle(pool, { schema, logger: true }) as NodePgDatabase<
      typeof schema
    >;
  },
};
