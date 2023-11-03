import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  import { ROLE } from '../constant/role.enum'
  import { ROLES_KEY } from '../decorators/roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();
  
      if (requiredRoles.some((role) => user.roles?.includes(role))) {
        return true;
      }
  
      throw new UnauthorizedException(
        `User with roles ${user.roles} can not access this resource`,
      );
    }
  }
  