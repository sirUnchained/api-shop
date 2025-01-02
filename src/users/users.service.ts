import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import userRoles from './enums/user.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let password: string | null = null;
      let role: userRoles = userRoles.user;
      if (createUserDto.password) {
        password = await bcrypt.hash(createUserDto.password, 10);
      }
      if (!(await this.userRepo.count())) {
        role = userRoles.admin;
      }

      const user = this.userRepo.create({
        ...createUserDto,
        password,
        role,
      });
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(limit: number, page: number) {
    try {
      limit = limit || 10;
      page = page || 1;
      return await this.userRepo.find({
        take: limit,
        skip: (page - 1) * limit,
        select: ['username', 'email', 'phone', 'role'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!Number(id)) {
        throw new BadRequestException('user not found.');
      }

      const user = await this.userRepo.findOne({
        where: { id },
        select: ['username', 'email', 'phone', 'role'],
      });
      if (!user) {
        throw new BadRequestException('user not found.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (!Number(id)) {
        throw new BadRequestException('user not found.');
      }

      await this.userRepo.update({ id }, updateUserDto);
      return { message: 'user updated.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!Number(id)) {
        throw new BadRequestException('user not found.');
      }

      const user = await this.userRepo.delete({ id });
      if (!user.affected) {
        throw new BadRequestException('user not found.');
      }

      return { message: 'user removed.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
