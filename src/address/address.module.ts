import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressEntity } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorazationMiddleware } from 'src/middleWares/authorazation.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, UserEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorazationMiddleware).forRoutes('address');
  }
}
