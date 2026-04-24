import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { CarouselModule } from './carousel/carousel.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AddressModule } from './address/address.module';
import { PromoModule } from './promo/promo.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    CartModule,
    UploadModule,
    CarouselModule,
    WishlistModule,
    AddressModule,
    PromoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
