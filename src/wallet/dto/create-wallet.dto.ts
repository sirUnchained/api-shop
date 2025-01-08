import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
