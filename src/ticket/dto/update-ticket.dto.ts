import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsNotEmpty()
  @IsString()
  reply_msg: string;
}
