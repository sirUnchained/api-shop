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
      throw new InternalServerErrorException('error ?');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
