import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderProductsDTO } from "./ordered-products.dto";

export class CreateOrderDto {
   @Type(()=> CreateShippingDto)
   @ValidateNested()
   shippedAddress: CreateShippingDto;

   @Type(()=> OrderProductsDTO)
   @ValidateNested()
   orderedProducts: OrderProductsDTO[];
}
