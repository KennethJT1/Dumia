import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderProductsDTO {
    @IsNotEmpty({ message: "Order products id not specified" })
    id: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be number and not more than 2 decimal value" })
    @IsPositive({ message: "Price must be positive value" })
    product_unit_price: number

    @IsNumber({}, { message: "Quantity must be number" })
    @IsPositive({ message: "Quantity must be positive value" })
    product_quantity: number
}