import { SetMetadata } from '@nestjs/common';
import { validRoles } from 'src/auth/interfaces/valid-roles';

export const META_ROLES = 'roles'; //Exportar constante para la clave de los roles

export const RoleProtected = (...args: validRoles[]) => {
    return SetMetadata(META_ROLES, args);
}
