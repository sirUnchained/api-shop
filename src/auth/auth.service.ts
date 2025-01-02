import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import userRoles from './enums/user.enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { username: loginDto.username },
      });
      if (!user) {
        return new BadRequestException('user not found.');
      }

      const checkPass = await bcrypt.compare(loginDto.password, user.password);
      if (!checkPass) {
        return new BadRequestException('invalid data.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async register(createUserDto: RegisterDto) {
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
}
