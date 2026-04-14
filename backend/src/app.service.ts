import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTS_REPOSITORY } from '../constants';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { ProductHasMedia } from './product/entities/product-has-media.entity';
import { ProductHasCategory } from './product/entities/product-has-category.entity';
@Injectable()
export class AppService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: typeof Product,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getProducts() {
    const data = await this.productsRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'slug', 'price'],
      include: [
        {
          model: ProductHasMedia,
          as: 'medias',
          attributes: ['id', 'path', 'filename', 'type', 'size'],
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        {
          model: ProductHasCategory,
          as: 'productCategories',
          attributes: ['id', 'categoryId'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name', 'slug'],
            },
          ],
        },
      ],
    });

    return data;
  }
}
