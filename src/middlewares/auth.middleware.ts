import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];

    // Check if the Authorization header exists
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    // Check if Authorization header contains either Bearer token or API key
    if (authorizationHeader?.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];
      // Validate the Bearer JWT token for internal APIs
      const result = await this.validateJwtToken(token);
      req['user'] = result;
    }

    next();
  }

  // Function to validate JWT token (for internal APIs)
  async validateJwtToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
      // You can add additional JWT validation logic here
      return decoded;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid JWT token.');
    }
  }
}
