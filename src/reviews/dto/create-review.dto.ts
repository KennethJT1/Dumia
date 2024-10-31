import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty({ message: "Product ID cannot be empty" })
    productId: string;

    @IsNumber()
    @IsPositive({ message: "Rating must be a positive number" })
    @IsNotEmpty({ message: "Rating cannot be empty" })
    rating: number;

    @IsString()
    @IsNotEmpty({ message: "Comment cannot be empty" })
    comment: string;
}
