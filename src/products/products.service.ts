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

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto); //Solo crea una instancia del repositorio.

      await this.productRepository.save(product); //Almacenarlo en la base de datos.

      return product;
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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
