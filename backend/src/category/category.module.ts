import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryProviders } from './category.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, ...CategoryProviders],
  exports: [CategoryService],
})
export class CategoryModule {}
