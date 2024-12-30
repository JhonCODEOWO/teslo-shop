import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { User } from "../entities/users.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

export class JwtStrategy extends PassportStrategy(Strategy){
    async validate(payload: JwtPayload): Promise<User>{
        const {email} = payload;
        
        return ;
    }
}