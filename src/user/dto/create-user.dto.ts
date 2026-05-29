import { IsNotEmpty, IsString, IsStrongPassword, IsNumber } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    phone: string;

}
