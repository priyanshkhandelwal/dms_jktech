import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  // Inject Reflector to potentially use metadata-based role checks (if needed in the future)
  constructor(private reflector: Reflector) {}

  // Implement the canActivate method to determine if the request can proceed
  canActivate(context: ExecutionContext): boolean {
    // Extract the request object from the context
    const request = context.switchToHttp().getRequest();

    // Retrieve the user from the request (this assumes the user is set by an authentication middleware)
    const user = request.user;

    // Check if the user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated'); // Throw exception if no user is found
    }

    // Check if the user has the 'ADMIN' role
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admins only.'); // Throw exception if role is not 'ADMIN'
    }

    // If the user is authenticated and has 'ADMIN' role, allow access to the route
    return true;
  }
}
