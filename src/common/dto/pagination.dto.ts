import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
    //Se deben convertir los elementos a number porque en query parameters nest siempre los recibe como strings
    @ApiProperty({
        default: 10,
        description: 'How many elements do u need'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //Convierte a limit en un número
    //Transformar datos
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'What page do u want to obtain of all the collection'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number) //Convierte a limit en un número
    offset?: number;
}