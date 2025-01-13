import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { BasketEntity } from './entities/basket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, BasketEntity])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
