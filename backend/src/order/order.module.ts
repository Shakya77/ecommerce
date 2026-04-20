import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderItemProviders, orderProviders } from './order.providers';
import { ProductModule } from 'src/product/product.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ProductModule, DatabaseModule],
  controllers: [OrderController],
  providers: [OrderService, ...orderProviders, ...orderItemProviders],
  exports: [OrderService],
})
export class OrderModule {}
