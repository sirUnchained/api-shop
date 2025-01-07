import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { throwError } from 'rxjs';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      if (!+createAddressDto.user_id) {
        throw new BadRequestException('user not found.');
      }

      const user = await this.userRepo.findOne({
        where: { id: +createAddressDto.user_id },
      });
      if (!user) {
        throw new BadRequestException('user not found.');
      }

      const checkAddress = await this.addressRepo.findOne({
        where: { postal_code: createAddressDto.postal_code },
      });
      if (checkAddress) {
        throw new BadRequestException('postal code already exist !');
      }

      const newAddress = this.addressRepo.create({
        ...createAddressDto,
        user_id: user,
      });
      await this.addressRepo.save(newAddress);

      return newAddress;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('somthing went wrong.');
    }
  }

  async findAll() {
    try {
      const addresses = await this.addressRepo.find({ relations: ['user_id'] });
      for (let i = 0; i < addresses.length; i++) {
        delete addresses[i].user_id.password;
      }
      return addresses;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('unknown error happens.');
    }
  }

  async findOne(currendUser: any, id: number) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('address not found.');
      }

      const address = await this.addressRepo.findOne({
        where: { id },
        relations: ['user_id'],
      });
      if (!address) {
        throw new BadRequestException('address not found.');
      }
      if (currendUser.id !== id) {
        throw new BadRequestException(
          'you are not allowed to access other users address.',
        );
      }

      delete address.user_id.password;
      return address;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('unknown error !');
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      if (!id) {
        throw new BadRequestException('address not found.');
      }

      const address = await this.addressRepo.findOne({ where: { id } });
      if (!address) {
        throw new BadRequestException('address not found.');
      }

      address.address = updateAddressDto.address;
      address.postal_code = updateAddressDto.postal_code;

      await this.addressRepo.save(address);

      return address;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('unknown error.');
    }
  }

  async remove(id: number) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('address not found.');
      }

      const address = await this.addressRepo.delete({
        id,
      });
      if (!address) {
        throw new BadRequestException('address not found.');
      }

      return address;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('unknown error.');
    }
  }
}
