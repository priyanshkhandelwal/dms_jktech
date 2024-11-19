import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ViewerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user has 'VIEWER' role
    if (user.role !== 'VIEWER') {
      throw new ForbiddenException('Access denied. Viewers only.');
    }

    // If authenticated and has 'VIEWER' role, allow access
    return true;
  }
}
