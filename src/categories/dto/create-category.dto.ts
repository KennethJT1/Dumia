import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: "Please fill in the title" })
    @IsString()
    title: string;

    @IsNotEmpty({ message: "Please fill in the description" })
    @IsString()
    description: string;
}
