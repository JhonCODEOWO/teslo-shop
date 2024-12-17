import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
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