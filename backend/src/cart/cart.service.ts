import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CARTS_REPOSITORY, PRODUCTS_REPOSITORY } from '../../constants';
import { Product } from 'src/product/entities/product.entity';
import { Sequelize } from 'sequelize';
import { Category } from 'src/category/entities/category.entity';
import { ProductHasCategory } from 'src/product/entities/product-has-category.entity';
import { ProductHasMedia } from 'src/product/entities/product-has-media.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject(CARTS_REPOSITORY)
    private readonly cartRepository: typeof Cart,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productRepository: typeof Product,
  ) {}

  async checkProduct(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async findOneByUser(productId: number, userId: number) {
    return await this.cartRepository.findOne({
      where: {
        isActive: true,
        userId,
        productId,
      },
    });
  }

  async create(createCartDto: CreateCartDto, user: { id: number }) {
    const existingCart = await this.findOneByUser(
      createCartDto.productId,
      user.id,
    );

    if (existingCart) {
      const data = await this.cartRepository.update(
        {
          quantity: Sequelize.literal(`quantity + ${createCartDto.quantity}`),
        },
        {
          where: { id: existingCart.id },
        },
      );

      return { message: 'Cart updated successfully' };
    }

    const product = await this.checkProduct(createCartDto.productId);

    const data = await this.cartRepository.create({
      ...createCartDto,
      price: product.price,
      userId: user.id,
    } as any as Cart);

    return data;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const data = await this.cartRepository.update(updateCartDto as any, {
      where: { id },
    });

    return { message: 'Cart updated successfully' };
  }

  async findAll(user: { id: number }) {
    return await this.cartRepository.findAll({
      where: { isActive: true, userId: user.id },
      include: [
        {
          model: Product,
          as: 'getProduct',
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
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async remove(id: number) {
    await this.cartRepository.update(
      {
        isActive: false,
      },
      {
        where: { id },
      },
    );

    return { message: 'Cart removed successfully' };
  }

  async cartCount(user: { id: number }) {
    const count = await this.cartRepository.count({
      where: { isActive: true, userId: user.id },
    });

    return { count };
  }
}
