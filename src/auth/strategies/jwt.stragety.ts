import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/users.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ){
        //Aplicar valores a el constructor principal
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Envíar token como bearertoken
        });
    }

    //Se va a ejecutar siempre y cuando el token siga activo y el token haga match con el payload
    async validate(payload: JwtPayload): Promise<User>{
        const {email, id} = payload;
        
        //Obtener usuario en base a el id en el payload.
        const user = await this.userRepository.findOneBy({id});

        if(!user) throw new UnauthorizedException('Token no valid');

        if(!user.isActive) throw new UnauthorizedException('User is inactive, talk with admin');

        return user; //Este dato retornado se va a añadir al request general
    }
}