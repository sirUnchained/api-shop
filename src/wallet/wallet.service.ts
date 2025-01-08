import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: createWalletDto.user_id },
      });
      if (!user) {
        throw new BadRequestException('user not found.');
      }

      const wallet = await this.walletRepo.findOne({
        where: { user_id: user },
      });
      if (wallet) {
        throw new BadRequestException('wallet already exist.');
      }

      const newWallet = this.walletRepo.create({
        amount: createWalletDto.amount || 0,
        user_id: user,
      });
      await this.walletRepo.save(newWallet);
      return 'done.';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('error ?');
    }
  }

  async findAll() {
    try {
      const wallets = await this.walletRepo.find({ relations: ['users'] });
      for (let i = 0; i < wallets.length; i++) {
        delete wallets[i].user_id.password;
      }
      return wallets;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('error ?');
    }
  }

  async findOne(id: number) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('user not found');
      }
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('user not found');
      }

      const wallet = await this.walletRepo.findOne({
        relations: ['users'],
        where: { user_id: user },
      });
      if (!wallet) {
        throw new BadRequestException('wallet not found');
      }
      delete wallet.user_id.password;

      return wallet;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('error ?');
    }
  }

  async update(id: number, updateWalletDto: UpdateWalletDto, req: any) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('user not found');
      }

      const wallet = await this.walletRepo.findOne({
        where: { id },
        relations: ['users'],
      });
      if (wallet) {
        throw new BadRequestException('wallet not found');
      }
      if (req.user.role !== 'admin' || req.user.id !== wallet.user_id.id) {
        return new BadRequestException(
          'you are not allowed to change this wallet.',
        );
      }

      const result = await this.walletRepo.update(
        { id },
        { amount: updateWalletDto.amount },
      );
      if (!result.affected) {
        throw new BadRequestException('wallet not found.');
      }

      return 'done';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('update error');
    }
  }

  async remove(id: number) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('user not found');
      }

      const result = await this.walletRepo.delete(id);
      if (!result.affected) {
        throw new BadRequestException('wallet not found.');
      }

      return 'done';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('update error');
    }
  }
}
