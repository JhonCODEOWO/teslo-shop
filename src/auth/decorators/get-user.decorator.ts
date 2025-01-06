import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/users.entity";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        
        const req = ctx.switchToHttp().getRequest(); //Obtener los datos de la petición
        
        const user = req.user as User;

        if(!user) throw new InternalServerErrorException('User not found in request GetUser, check if you are using this in a authenticated route');

        return (!data)? user: user[data];
    }
);