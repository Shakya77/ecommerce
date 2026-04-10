import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productProviders } from './product.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [DatabaseModule, CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, ...productProviders],
  exports: [ProductService],
})
export class ProductModule {}
