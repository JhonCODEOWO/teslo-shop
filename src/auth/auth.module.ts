import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Type } from 'class-transformer';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule.register({defaultStrategy: 'jwt'}),

    // JwtModule.register({
    //   secret: '123456',
    //   signOptions: {
    //     expiresIn: '2h'
    //   }
    // })

    JwtModule.registerAsync({
      imports: [ ConfigModule ], //Importar módulos
      inject: [ConfigService], //Inyectar servicios u otros elementos pertenecientes a los módulos importados.
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class AuthModule {}
