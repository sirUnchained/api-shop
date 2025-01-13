import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { And, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private readonly basketRepo: Repository<BasketEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async create(createBasketDto: CreateBasketDto, req: any) {
    try {
      const checkProduct = await this.productRepo.findOne({
        where: { id: createBasketDto.product },
      });
      if (!checkProduct) {
        throw new BadRequestException('product not found.');
      }

      const checkUserProductBasket = await this.basketRepo.findOne({
        where: {
          user: req.user.id,
          product: checkProduct.id as any,
        },
      });
      if (checkUserProductBasket) {
        throw new BadRequestException('product is already in basket.');
      }

      const newItem = this.basketRepo.create({
        product: checkProduct,
        user: req.user,
        quantity: createBasketDto.quantity,
      });
      await this.basketRepo.save(newItem);

      delete newItem.user.password;

      return newItem;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(req: any) {
    try {
      const user = req.user;
      console.log(user);
      const products = this.basketRepo.find({
        where: { user: user },
        relations: ['product', 'user'],
      });
      return products;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, req: any) {
    try {
      if (!id) {
        throw new BadRequestException('product not found');
      }

      const user = req.user;
      const product = this.basketRepo.findOne({
        where: { user: user, product: { id } },
      });
      if (!product) {
        throw new BadRequestException('product not found.');
      }

      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateBasketDto: UpdateBasketDto, req: any) {
    try {
      if (!id) {
        throw new BadRequestException('product not found');
      }

      const checkProduct = await this.productRepo.findOne({
        where: { id: updateBasketDto.product },
      });
      if (!checkProduct) {
        throw new BadRequestException('product not found.');
      }

      const checkUserProductBasket = await this.basketRepo.findOne({
        where: { product: checkProduct, user: req.user },
      });
      if (!checkUserProductBasket) {
        throw new BadRequestException('product is already in basket.');
      }

      checkUserProductBasket.quantity = updateBasketDto.quantity;
      await this.basketRepo.update({ id }, checkUserProductBasket);

      return checkUserProductBasket;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number, req: any) {
    try {
      if (!id) {
        throw new BadRequestException('product not found');
      }

      const result = await this.basketRepo.delete({ id, user: req.user });
      if (!result.affected) {
        throw new BadRequestException('product in basket not found');
      }

      return 'done.';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
