import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const slug: string = createCategoryDto.title
        .toLowerCase()
        .replace(/\s+/g, '-');

      const checkCategoryExist = await this.categoryRepo.findOne({
        where: { slug },
      });
      if (checkCategoryExist) {
        throw new BadRequestException('category already exist');
      }

      const newCategory = this.categoryRepo.create({
        ...createCategoryDto,
        slug,
      });
      await this.categoryRepo.save(newCategory);

      return newCategory;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepo.find();
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('category not found');
      }

      const category = await this.categoryRepo.findOne({ where: { id } });
      if (!category) {
        throw new BadRequestException(`Category with id ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      if (!id) {
        throw new BadRequestException('category not found');
      }
      const targetCategory = await this.categoryRepo.findOne({ where: { id } });
      if (!targetCategory) {
        throw new BadRequestException(`Category with id ${id} not found`);
      }

      const slug: string = updateCategoryDto.title
        .toLowerCase()
        .replace(/\s+/g, '-');

      const checkCategoryExist = await this.categoryRepo.findOne({
        where: { slug },
      });
      if (checkCategoryExist) {
        throw new BadRequestException('category slug already exist');
      }

      targetCategory.slug = slug;
      targetCategory.title = updateCategoryDto.title;

      await this.categoryRepo.update({ id }, targetCategory);

      return targetCategory;
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
        throw new BadRequestException('category not found');
      }

      const result = await this.categoryRepo.delete(id);
      if (!result.affected) {
        throw new BadRequestException(`Category with id ${id} not found`);
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
