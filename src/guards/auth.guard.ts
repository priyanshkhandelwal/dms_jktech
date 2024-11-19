import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    // Allow access to public routes
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    // Validate the Authorization header
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    if (authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];
      try {
        // Validate JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded; // Attach the decoded user info to the request
        return true;
      } catch (error) {
        console.error('JWT verification error:', error);
        throw new UnauthorizedException('Invalid JWT token.');
      }
    }

    throw new UnauthorizedException('Invalid authorization header format.');
  }
}
