import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, //Desde env
      port: +process.env.DB_PORT, //Puerto desde env
      database: process.env.DB_NAME, //Nombre bd desde env
      username: process.env.DB_USERNAME, // UserName desde env
      password: process.env.DB_PASSWORD, // Contraseña desde env
      autoLoadEntities: true, //Carga automáticamente las entidades que se van definiendo
      synchronize: true //No debe estar en producción, sincroniza los cambios en las entidades 
    }),

    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
