import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async runSeed(){
    await this.deleteTables(); //Borrar todas las tablas
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return 'Seed executed';
  }

  private async deleteTables(){
    await this.productService.deleteAllProducts(); //Eliminar productos

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
    .delete()
    .where({})
    .execute();
  }
  
  private async insertNewUsers(){
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user =>{
      console.log(user);
      users.push(this.userRepository.create(user)); //Añade al arreglo un objeto de la entidad user con los datos listos para poder ser agregados a la base de datos.
    })

    const usersSaved = await this.userRepository.save( users ); //Recibe un arreglo de la entidad User y almacena todo en la base de datos.

    return usersSaved[0]; //Retornar al menos un usuario creado para poder añadirlo a los productos
  }


  private async insertNewProducts(user: User){

    //Crear productos.
    const products = initialData.products;
    const insertPromises = [];

    //Recorrer productos
    products.forEach(product => {
    //De cada producto se añade la promesa hacia un arreglo
    insertPromises.push(this.productService.create(product, user));
    })

    //Esperar a que todas las promesas se resuelvan
    await Promise.all(insertPromises);
    
    return true;
  }
}
