import { IsNotEmpty, Length, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Length(3, 250)
  title: string;

  @IsNotEmpty()
  @MaxLength(250)
  price: string;

  @IsNotEmpty()
  @MaxLength(250)
  description: string;

  @IsNotEmpty()
  @Min(0)
  stock: number;

  @IsNotEmpty()
  @Min(1)
  category: number;
}
