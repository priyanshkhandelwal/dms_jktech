import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly reflector: Reflector) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Use Reflector to check if the route is marked as public
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      req.route?.path, // Use the path from the request
    );

    if (isPublic) {
      return next(); // Skip authentication for public routes
    }

    const authorizationHeader = req.headers['authorization'];

    // Check if the Authorization header exists
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    // Check if Authorization header contains a Bearer token
    if (authorizationHeader?.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];
      // Validate the Bearer JWT token for internal APIs
      const result = await this.validateJwtToken(token);
      req['user'] = result;
    } else {
      throw new UnauthorizedException('Invalid authorization header format.');
    }

    next();
  }

  // Function to validate JWT token (for internal APIs)
  async validateJwtToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
      return decoded;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid JWT token.');
    }
  }
}
