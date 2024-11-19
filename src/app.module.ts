import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { drizzleProvider } from './drizzle/drizzle.provider';
import { DocumentModule } from './document/document.module';
import { APP_GUARD } from '@nestjs/core';

import * as dotenv from 'dotenv';
import { AuthGuard } from './guards/auth.guard';
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    TypeOrmModule.forRoot({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: false, // Or true depending on your case
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
    UserModule,
    RoleModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    drizzleProvider,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Apply AuthGuard globally
    },
  ],
})
export class AppModule {}
