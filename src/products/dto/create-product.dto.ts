import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;
    
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({each: true}) //Cada elemento que venga debe ser de tipo string
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex']) //Verifica que el valor recibido exista dentro de los declarados en la matríz del argumento.
    gender: string;
}
