import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import userRoles from '../enums/user.enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @Matches(/((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g, {
    message: 'phone is not valid.',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @Length(8, 100)
  password: string;

  @IsOptional()
  @IsString()
  @IsEnum(userRoles)
  role: userRoles;
}
