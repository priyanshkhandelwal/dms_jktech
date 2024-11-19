import { SetMetadata } from '@nestjs/common';

// Define a constant key for identifying public routes
export const IS_PUBLIC_KEY = 'isPublic';

// Create a custom decorator to mark routes as public
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // Set the metadata key 'isPublic' to true for public routes
