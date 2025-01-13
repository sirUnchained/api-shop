import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBasketDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  product: number;
}
