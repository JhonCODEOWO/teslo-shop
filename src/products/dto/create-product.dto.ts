import { ApiProperty } from "@nestjs/swagger";
import { isArray, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;
    
    @ApiProperty({
        nullable: true,
        type: 'number',
        format: 'positive'
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({each: true}) //Cada elemento que venga debe ser de tipo string
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men', 'women', 'kid', 'unisex']) //Verifica que el valor recibido exista dentro de los declarados en la matríz del argumento.
    gender: string;

    @ApiProperty()
    @IsOptional()
    @IsString({each: true}) //Valida que cada elemento del array sea string
    @IsArray() //Valida que el dato recibido eaun string
    tags?: string[]

    @ApiProperty()
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
