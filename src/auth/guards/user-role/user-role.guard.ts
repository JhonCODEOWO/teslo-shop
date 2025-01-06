import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/users.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles : string[] = this.reflector.get('roles', context.getHandler()); //Obtener la metadata declarada previamente con un decorador

    const req = context.switchToHttp().getRequest(); //Obtener los datos de la petición

    const user = req.user as User;

    //Si no se pudo obtener el usuario...
    if(!user) throw new BadRequestException('User not found in UserRoleGuard');

    //Recorrer roles del usuario
    for(const role of user.roles){
      //Si un rol coincide con uno de los que se digitaron como necesarios entonces...
      if(validRoles.includes(role)){
        return true;
      }
    }

    throw new ForbiddenException( `User ${user.fullname} need a valid role: [${validRoles}]`);
  }
}
