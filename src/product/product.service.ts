import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const slug: string = createProductDto.title
        .replaceAll(/\s|_/g, '-')
        .toLowerCase();
      const checkExist = this.productRepo.findOne({ where: { slug } });
      if (!checkExist) {
        throw new BadRequestException('product slug already exists.');
      }

      const newProduct = this.productRepo.create(createProductDto);
      await this.productRepo.save(newProduct);

      return newProduct;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.productRepo.find();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('priduct not found !');
      }
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) {
        throw new BadRequestException('product not found ');
      }

      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      if (!id) {
        throw new BadRequestException('priduct not found !');
      }

      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) {
        throw new BadRequestException('priduct not found !');
      }

      for (const option in updateProductDto) {
        product[option] = updateProductDto[option];
      }

      const result = await this.productRepo.update({ id: id }, product);
      if (!result.affected) {
        throw new BadRequestException('priduct not found !');
      }
      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('priduct not found !');
      }

      const removed = await this.productRepo.delete(id);
      if (!removed.affected) {
        throw new BadRequestException('priduct not found !');
      }

      return 'done';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
