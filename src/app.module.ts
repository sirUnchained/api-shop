import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { AddressEntity } from './address/entities/address.entity';
import { authorizationMiddleware } from './middleWares/authorization .middleware';
import { AdminRole } from './middleWares/adminRole.middleware';
import { WalletModule } from './wallet/wallet.module';
import { WalletEntity } from './wallet/entities/wallet.entity';
import { TicketModule } from './ticket/ticket.module';
import { TicketEntity } from './ticket/entities/ticket.entity';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/entities/product.entity';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { BasketModule } from './basket/basket.module';
import { BasketEntity } from './basket/entities/basket.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'api-shop',
      entities: [
        UserEntity,
        AddressEntity,
        WalletEntity,
        TicketEntity,
        CategoryEntity,
        ProductEntity,
        BasketEntity,
      ],
      synchronize: true,
    }),
    AuthModule,
    AddressModule,
    UsersModule,
    WalletModule,
    ProductModule,
    CategoryModule,
    TicketModule,
    BasketModule,
    TypeOrmModule.forFeature([
      AddressEntity,
      UserEntity,
      WalletEntity,
      TicketEntity,
      CategoryEntity,
      ProductEntity,
      BasketEntity,
    ]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authorizationMiddleware)
      .forRoutes(
        { path: 'address/*', method: RequestMethod.ALL },
        { path: 'users/*', method: RequestMethod.ALL },
        { path: 'wallet/*', method: RequestMethod.ALL },
        { path: 'ticket*', method: RequestMethod.ALL },
        { path: 'product', method: RequestMethod.POST },
        { path: 'product', method: RequestMethod.PATCH },
        { path: 'product', method: RequestMethod.DELETE },
        { path: 'basket', method: RequestMethod.ALL },
      );
    consumer
      .apply(AdminRole)
      .forRoutes(
        { path: 'address/:id', method: RequestMethod.DELETE },
        { path: 'address/:id', method: RequestMethod.PATCH },
        { path: 'users/*', method: RequestMethod.GET },
        { path: 'users/*', method: RequestMethod.DELETE },
        { path: 'wallet/:id', method: RequestMethod.DELETE },
        { path: 'ticket/*', method: RequestMethod.PATCH },
        { path: 'ticket/*', method: RequestMethod.DELETE },
        { path: 'ticket/*', method: RequestMethod.DELETE },
        { path: 'ticket', method: RequestMethod.GET },
        { path: 'product', method: RequestMethod.POST },
        { path: 'product', method: RequestMethod.PATCH },
        { path: 'product', method: RequestMethod.DELETE },
      );
  }
}
