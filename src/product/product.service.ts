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

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return 'This action adds a new product';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    try {
      return 'This action adds a new product';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
