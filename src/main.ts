import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Import Swagger utilities for setting up API documentation
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger with metadata for the API
  const config = new DocumentBuilder()
    .setTitle('DMS App') // Set the title of the API documentation
    .setDescription('API documentation for Document Management System') // Provide a description of the API
    .addServer('http://localhost:3000/') // Specify a base server URL
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Define JWT-based authentication
      'Authorization', // Reference name for the authentication scheme
    )
    .setVersion('1.0') // Specify the version of the API
    .build();

  // Generate the Swagger document based on the configured metadata
  const document = SwaggerModule.createDocument(app, config);

  // Set up Swagger UI at the `/api` endpoint
  SwaggerModule.setup('api', app, document);

  // Enable CORS with specific options
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-id',
      'Access-Control-Allow-Origin',
      'st-auth-mode',
      'rid',
    ],
  });

  // Start the application and listen on the specified port
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
