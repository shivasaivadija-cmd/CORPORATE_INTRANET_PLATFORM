import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@intranet/types';
import { ROLES_KEY } from '@common/decorators/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Access denied');

    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.SUPER_ADMIN]: 100,
      [UserRole.TENANT_ADMIN]: 80,
      [UserRole.DEPARTMENT_ADMIN]: 60,
      [UserRole.MODERATOR]: 40,
      [UserRole.EMPLOYEE]: 20,
      [UserRole.GUEST]: 10,
    };

    const userLevel = roleHierarchy[user.role as UserRole] || 0;
    const hasRole = requiredRoles.some((role) => userLevel >= roleHierarchy[role]);

    if (!hasRole) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
