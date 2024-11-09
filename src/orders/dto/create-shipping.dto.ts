import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty({ message: "Please enter your phone number" })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: "Please enter your address" })
    address: string;

    @IsString()
    @IsNotEmpty({ message: "Please enter your city" })
    city: string;

    @IsString()
    @IsNotEmpty({ message: "Please enter your postcode" })
    postCode: string;

    @IsString()
    @IsNotEmpty({ message: "Please enter your state" })
    state: string;

    @IsString()
    @IsNotEmpty({ message: "Please enter your country" })
    country: string;
}
