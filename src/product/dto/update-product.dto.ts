import { Optional } from '@nestjs/common';
import { Length, MaxLength, Min } from 'class-validator';

export class UpdateProductDto {
  @Optional()
  @Length(3, 250)
  title: string;

  @Optional()
  slug: string;

  @Optional()
  @MaxLength(250)
  price: string;

  @Optional()
  @MaxLength(250)
  description: string;

  @Optional()
  @Min(0)
  stock: number;
}
