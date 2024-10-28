import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty({ message: "Please fill in your email" })
    email: string;

    @IsNotEmpty({ message: "Please fill in your password" })
    @MinLength(4, { message: "Password can not be less than 4 characters" })
    password: string;
}
