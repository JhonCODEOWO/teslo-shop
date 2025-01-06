import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { request } from "http";

//Este decorador es un decorador más global, pues no depende de la existencia de la autenticación
export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();

        return req.rawHeaders as String[];
    }
)