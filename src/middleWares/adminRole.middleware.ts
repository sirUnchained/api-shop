import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class AdminRole implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    try {
      if (req.user.role == 'admin') {
        next();
      }
      throw new ForbiddenException('this route is protected.');
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('error.');
    }
  }
}
