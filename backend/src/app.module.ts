import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ProdutModule } from './produt/produt.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, DatabaseModule, UsersModule, CategoryModule, ProdutModule, OrderModule, PaymentModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
