// Import the `Module` decorator from NestJS to define a module
import { Module } from '@nestjs/common';

// Import the `drizzleProvider` which sets up the Drizzle ORM instance
import { drizzleProvider } from './drizzle.provider';

// Import the `ConfigModule` from NestJS to manage application configuration
import { ConfigModule } from '@nestjs/config';

// Define the `DrizzleModule` to encapsulate and provide the Drizzle ORM functionality
@Module({
  // Import the `ConfigModule` for accessing configuration within this module
  imports: [ConfigModule],

  // Register the `drizzleProvider` as a provider for dependency injection
  providers: [drizzleProvider],

  // Export the `drizzleProvider` so it can be used in other modules
  exports: [drizzleProvider],
})
export class DrizzleModule {}
