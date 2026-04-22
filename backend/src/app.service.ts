import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CATEGORIES_REPOSITORY,
  ORDER_REPOSITORY,
  PRODUCTS_REPOSITORY,
} from '../constants';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { ProductHasMedia } from './product/entities/product-has-media.entity';
import { ProductHasCategory } from './product/entities/product-has-category.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
@Injectable()
export class AppService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: typeof Product,

    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: typeof Category,

    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
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

  async getProductDetail(slug: string) {
    const data = await this.productsRepository.findOne({
      where: { slug },
      include: [
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
        {
          model: ProductHasMedia,
          as: 'medias',
          attributes: ['id', 'path', 'filename', 'type', 'size'],
        },
      ],
    });

    if (!data) {
      throw new BadRequestException('Product not found');
    }

    return data;
  }

  async getCategories() {
    const data = await this.categoriesRepository.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'slug'],
    });

    return data;
  }

  async getOrders(user: { id: number }) {
    return await this.orderRepository.findAll({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'getProduct',
              attributes: ['id', 'name', 'slug', 'price'],
              include: [
                {
                  model: ProductHasMedia,
                  as: 'medias',
                  attributes: ['id', 'path', 'filename', 'type', 'size'],
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
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
