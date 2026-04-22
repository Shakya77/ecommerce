import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from 'src/product/product.module';
import { cartProviders } from './cart.providers';

@Module({
  imports: [ProductModule],
  controllers: [CartController],
  providers: [CartService, ...cartProviders],
  exports: [CartService, ...cartProviders],
})
export class CartModule {}
