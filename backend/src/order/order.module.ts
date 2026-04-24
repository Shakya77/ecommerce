import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderItemProviders, orderProviders } from './order.providers';
import { ProductModule } from 'src/product/product.module';
import { DatabaseModule } from 'src/database/database.module';
import { CartModule } from 'src/cart/cart.module';
import { PromoModule } from 'src/promo/promo.module';

@Module({
  imports: [ProductModule, DatabaseModule, CartModule, PromoModule],
  controllers: [OrderController],
  providers: [OrderService, ...orderProviders, ...orderItemProviders],
  exports: [OrderService, ...orderProviders, ...orderItemProviders],
})
export class OrderModule {}
