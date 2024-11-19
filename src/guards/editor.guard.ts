import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EditorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user has 'EDITOR' role
    if (user.role !== 'EDITOR') {
      throw new ForbiddenException('Access denied. Editors only.');
    }

    // If authenticated and has 'EDITOR' role, allow access
    return true;
  }
}
