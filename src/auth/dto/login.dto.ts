import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  @Length(8, 100)
  password: string;
}
