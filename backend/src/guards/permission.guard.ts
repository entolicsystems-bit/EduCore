import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions: string[] =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];

    if (!requiredPermissions.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.id) return false;

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    const userPermissions = userRoles
      .flatMap((ur) => ur.role.permissions)
      .map((rp) => `${rp.permission.module}:${rp.permission.action}`);

    return requiredPermissions.every((p) => userPermissions.includes(p));
  }
}
