
import { applyDecorators, UseGuards } from '@nestjs/common';
import { validRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: validRoles[]) {
  return applyDecorators(
    RoleProtected( ...roles ), //Envíar roles como valores individuales y no como un arreglo roles por lo que el decorador recibe directamente los valores como vienen en el argumento sin tratarlos como arreglo
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}
