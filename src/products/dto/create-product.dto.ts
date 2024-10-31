import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({ message: "Product title cannot be empty" })
    title: string;

    @IsString()
    @IsNotEmpty({ message: "Product description cannot be empty" })
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Product price must be a number & decimal place of 2" })
    @IsPositive({ message: "Product price must be a positive number" })
    @IsNotEmpty({ message: "Product price cannot be empty" })
    price: number;

    @IsNumber({}, { message: "Product stock must be a number" })
    @IsNotEmpty({ message: "Product stock cannot be empty" })
    @Min(0, { message: "Stock cannot be negative" })
    stock: number;

    @IsNotEmpty({ message: "Image  cannot be empty" })
    @IsArray()
    images: string[];

    @IsString()
    @IsNotEmpty({ message: "Product category cannot be empty" })
    categoryId: string;
}
