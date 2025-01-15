import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/users.entity';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(validRoles.admin)
  @ApiResponse({status: 201, description: 'Product was created', type: Product})
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 403, description: 'Forbidden. Token related'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiResponse({ status: 200, type: Product, isArray: true})
  @ApiResponse({ status: 500, description: 'An error not handled yet'})
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @ApiResponse({
    status: 200,
    type: Product,
    description: 'Product finded',
  })
  @ApiResponse({
    status: 404,
    description: 'The product doesnt exists'
  })
  @ApiParam({
    name: 'term',
    description: 'A string with uuid, title or slug to search',
    example: 't_shirt, t shirt or uui string'
  })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @ApiResponse({
    status: 400,
    description: 'Bad request exception, the id probably doesnt exist in database'
  })
  @ApiParam({name: 'id', description: 'Id of the product'})
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user:User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiParam({name: 'id', description: 'Id of the product'})
  @ApiResponse({
    status: 404,
    description: 'The product doesnt exist in database'
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
