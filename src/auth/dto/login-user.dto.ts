import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{
    @IsString()
    @IsEmail()
    email: string; //Valida que sea un string y tenga formato de email

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string; //Valida que sea un string, tenga un mínimo de 6 caracteres con un máximo de 50 y verifica que almenos tenga una letra mayúscula, minúscula y un número
}