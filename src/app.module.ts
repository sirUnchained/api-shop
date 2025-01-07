import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { AddressEntity } from './address/entities/address.entity';
import { AuthorazationMiddleware } from './middleWares/authorazation.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'api-shop',
      entities: [UserEntity, AddressEntity],
      synchronize: true,
    }),
    AuthModule,
    AddressModule,
    UsersModule,
    TypeOrmModule.forFeature([AddressEntity, UserEntity]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorazationMiddleware).forRoutes('address');
  }
}
