import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {validate as isUUID} from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      //Desestructurar el dto y obtener las imagenes por separado de los datos de un producto...
      const { images = [], ...productDetails } = createProductDto;


      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })) //Recorrer los datos dentro de images y crea un registro, TypeORM automáticamente relaciona esas imagenes a el producto
      }); //Solo crea una instancia del repositorio.

      await this.productRepository.save(product); //Almacenarlo en la base de datos.

      //Retorna el objeto product con la propiedad images como la destructurada
      return {...product, images};
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //TODO: PAGINAR
  findAll(paginationDto: PaginationDto) {
    try {
      //Limit y offser con valores por defecto.
      const {limit=10, offset=0} = paginationDto;
      return this.productRepository.find({
        take: limit,
        skip: offset

        //TODO: RELACIONES
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {

    let product: Product;

    //Saber si es un uuid el termino de búsqueda.
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({ id: term });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();

      product = await queryBuilder
        .where(`UPPER(title) = :title or slug = :slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        }).getOne();
    }

    if (!product) throw new NotFoundException(`The product that you're searching by ${term} doesn't exists`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //Obtiene un objeto del tipo Product y asigna todos los datos que tiene updateProductDto pero no actualiza, sin embargo es una instancia que apunta al registro en la base de datos.
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    });

    if(!product) new BadRequestException(`The product with ID ${id} doesn't exists`);

    //Guardar nuevo objeto el método guarda si el objeto no existe o actualiza en caso contrario.
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unknown error, check logs to see what happened',
    );
  }
}
