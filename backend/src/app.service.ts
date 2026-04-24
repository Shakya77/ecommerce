import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CAROUSEL_REPOSITORY,
  CATEGORIES_REPOSITORY,
  ORDER_REPOSITORY,
  PRODUCTS_REPOSITORY,
  PROMO_REPOSITORY,
} from '../constants';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { ProductHasMedia } from './product/entities/product-has-media.entity';
import { ProductHasCategory } from './product/entities/product-has-category.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { Carousel } from './carousel/entities/carousel.entity';
import { Op } from 'sequelize';
import { Promo } from './promo/entities/promo.entity';
@Injectable()
export class AppService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: typeof Product,

    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: typeof Category,

    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,

    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepository: typeof Carousel,

    @Inject(PROMO_REPOSITORY)
    private readonly promoRepository: typeof Promo,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCarousels() {
    const data = await this.carouselRepository.findAll({
      order: [['createdAt', 'DESC']],
    });

    return data;
  }

  async getProducts(search: string, limit = 10, page = 1, categories = '') {
    const offset = (page - 1) * limit;
    const categoryIds = categories
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);
    const hasCategoryFilter = categoryIds.length > 0;

    const { rows, count } = await this.productsRepository.findAndCountAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
      },
      order: [
        ['id', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
      distinct: true,
      attributes: ['id', 'name', 'slug', 'price', 'createdAt'],
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
          where: hasCategoryFilter
            ? {
                categoryId: {
                  [Op.in]: categoryIds,
                },
              }
            : undefined,
          required: hasCategoryFilter,
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

    return {
      data: rows,
      total: count,
      hasMore: offset + rows.length < count,
      page,
    };
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

  async getPromoCodes() {
    return await this.promoRepository.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }
}
