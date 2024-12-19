import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService){}

  async runSeed(){
    await this.insertNewProducts();
    return 'Seed executed';
  }

  private async insertNewProducts(){
    await this.productService.deleteAllProducts();

    //Crear productos.
    const products = initialData.products;
    const insertPromises = [];

    //Recorrer productos
    products.forEach(product => {
      //De cada producto se añade la promesa hacia un arreglo
      insertPromises.push(this.productService.create(product));
    })

    //Esperar a que todas las promesas se resuelvan
    await Promise.all(insertPromises);
    
    return true;
  }
}
