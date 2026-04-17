import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { cartProviders } from './cart.providers';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [CartController],
  providers: [CartService, ...cartProviders],
})
export class CartModule {}
