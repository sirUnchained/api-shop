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
import * as bcrypt from 'bcryptjs';
import userRoles from './enums/user.enums';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly JwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { username: loginDto.username },
      });
      if (!user) {
        return new BadRequestException('user not found.');
      }

      const checkPass = bcrypt.compareSync(loginDto.password, user.password);
      if (!checkPass) {
        return new BadRequestException('invalid data.');
      }

      const payload = { id: user.id };
      const token = this.JwtService.sign(payload);
      return token;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async register(createUserDto: RegisterDto) {
    try {
      const checkUser = await this.userRepo.findOne({
        where: { username: createUserDto.username, phone: createUserDto.phone },
      });
      if (checkUser) {
        return new BadRequestException('user already exist.');
      }

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

      const token = this.JwtService.sign(
        { id: user.id },
        { secret: 'secret_key' },
      );
      return token;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
