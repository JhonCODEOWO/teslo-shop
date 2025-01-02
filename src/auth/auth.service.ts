import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt'; //Importar bcrypt
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ){}
  
  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} =  createUserDto; //Desestructurar objeto en los elementos que vamos a manipular
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10) //Encriptar contraseña
      });

      await this.userRepository.save(user); //Guardar el elemento nuevo en la base de datos.

      delete user.password; //Quitar la propiedad password del objeto tipo user.

      return {
        ...user,
        token: this.getJwtToken({email: user.email, id: user.id})
      };
      //TODO: Retornar el JWT de acceso

    } catch (error) {
      this.handleDBErrors(error); //Manipular errores
    }
  }

  async login(loginUser: LoginUserDto){
    const {password, email} = loginUser; //Desestructurar.

    const user = await this.userRepository.findOne({
      where: { email },
      select: {email: true, password: true, id: true}
    }); //Encontrar un elemento por el email y obtener el registro en base al correo obteniendo solo email y password

    if(!user) throw new UnauthorizedException(`The user with email ${email} doesn't exists, try again`);

    //Comparar contraseña con el password en el body.
    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Credentials are not valid, try again`); 

    return {
      ...user,
      token: this.getJwtToken({email: user.email, id: user.id})
    };
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleDBErrors(error: any): never{
    console.log(error.code);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException('An unexpected error has received in auth.service check logs');
  }
}
