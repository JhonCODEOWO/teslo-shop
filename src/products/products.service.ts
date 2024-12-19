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
import { DataSource, Repository } from 'typeorm';
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
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
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
  async findAll(paginationDto: PaginationDto) {
    try {
      //Limit y offser con valores por defecto.
      const {limit=10, offset=0} = paginationDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,

        //TODO: RELACIONES
        relations: {
          images: true, //Elegir images como una relación a mostrar
        }
      });


      return products.map( product =>({ //Recorre todo el arreglo y devuelve un nuevo arreglo que contiene el producto en spread con la propiedad images personalizada
        ...product,
        images: product.images.map( image => image.url) //Recorre el arreglo images y por cada imagen va a devolver como valor nuevo solo el url
      }));
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
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where(`UPPER(title) = :title or slug = :slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) throw new NotFoundException(`The product that you're searching by ${term} doesn't exists`);

    return product;
  }

  async findOnePlain(term: string){
    const {images = [], ...details}= await this.findOne(term);

    return {
      ...details,
      images: images.map(image => image.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    //Desestructurar dto
    const {images, ...toUpdate} = updateProductDto;

    //Precarga un registro en la base de datos sustituyendo los valores por los ingresados como parámetro excepto el id
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate
    });

    //Si product es null..
    if(!product) new BadRequestException(`The product with ID ${id} doesn't exists`);

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();

    //Realizar conexión
    await queryRunner.connect();
    //Comenzar transacción
    await queryRunner.startTransaction();

    //Guardar nuevo objeto el método guarda si el objeto no existe o actualiza en caso contrario.
    try {
      //Validar si las imagenes están presentes.
      if(images){
        //Borrar imagenes: Primer argumento es la entidad a afectar y segundo argumento el criterio para eliminarlos.
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        //Añadir nuevas imagenes hacia el objeto preload del registro cargando instancias de ProductImages
        product.images = images.map(
          image => this.productImageRepository.create({url: image})
        );
      } else {
        //TO DO: CASO EN DONDE NO HAY DATOS EN IMAGES
      }

      //Intenta guardar el registro
      await queryRunner.manager.save(product);

      //Realizar transacción e impactar la base de datos
      await queryRunner.commitTransaction();

      //Liberar y cerrar queryRunner
      await queryRunner.release();

      return this.findOnePlain(product.id);
    } catch (error) {

      //Cancelar cualquier cambio hecho en la base de datos.
      await queryRunner.rollbackTransaction();

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

  //Solo para producción, borra todos los productos.
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
          .delete()
          .where({})
          .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
