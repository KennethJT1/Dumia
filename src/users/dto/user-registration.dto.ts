import { IsNotEmpty, IsString } from "class-validator";
import { UserLoginDto } from "./user-login.dto";

export class UserRegistrationDto extends UserLoginDto {
    @IsNotEmpty({ message: "Please fill in your name" })
    @IsString()
    name: string;
}
