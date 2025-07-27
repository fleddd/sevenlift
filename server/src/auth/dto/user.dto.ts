import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, isString, IsString, IsStrongPassword } from "class-validator";
import { Provider } from "generated/prisma";




export class RegisterUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;


    @IsNotEmpty()
    @IsString()
    name: string;
}
