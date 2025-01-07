import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsNotEmpty()
  @IsString()
  postal_code: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
