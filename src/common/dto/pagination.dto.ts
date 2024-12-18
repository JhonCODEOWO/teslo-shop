import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
    //Se deben convertir los elementos a number porque en query parameters nest siempre los recibe como strings
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //Convierte a limit en un número
    //Transformar datos
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) //Convierte a limit en un número
    offset?: number;
}