import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressEntity } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, UserEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
