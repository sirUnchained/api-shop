import { IsNotEmpty, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Length(3, 250)
  title: string;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Min(0)
  stock: number;
}
