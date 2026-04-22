import { Inject, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WISHLIST_REPOSITORY } from '../../constants';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductHasMedia } from 'src/product/entities/product-has-media.entity';
import { ProductHasCategory } from 'src/product/entities/product-has-category.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepository: typeof Wishlist,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: any) {
    const check = await this.findOne(createWishlistDto.productId, user);

    if (check) {
      return { message: 'Product already in wishlist' };
    }

    const data = await this.wishlistRepository.create({
      ...createWishlistDto,
      userId: user.id,
    } as any as Wishlist);

    return { message: 'Product added to wishlist successfully' };
  }

  async findAll(user: any) {
    return await this.wishlistRepository.findAll({
      where: { userId: user.id },
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
    });
  }

  async findOne(id: number, user: any) {
    const data = await this.wishlistRepository.findOne({
      where: { productId: id, userId: user.id },
    });

    return data;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  async remove(id: number, user: any) {
    const data = await this.wishlistRepository.destroy({
      where: { productId: id, userId: user.id },
    });

    return { message: 'Item removed from wishlist successfully' };
  }
}
