import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request } from 'express';

import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class authorizationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  use(req: Request, res: any, next: () => void) {
    try {
      const bearerToken = req.headers.authorization?.split(' ')[1];
      if (!bearerToken) {
        throw new BadRequestException('unauthorized.');
      }

      const payload = jwt.verify(bearerToken, 'secret_key') as any;
      const user = this.userRepository.findOne({ where: { id: +payload.id } });
      if (!user) {
        throw new BadRequestException('unauthorized.');
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('error.');
    }
  }
}
