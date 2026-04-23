import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { col, fn, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import slugify from 'slugify';
import {
  PRODUCT_HAS_CATEGORY_REPOSITORY,
  PRODUCT_HAS_MEDIA_REPOSITORY,
  PRODUCTS_REPOSITORY,
} from '../../constants';
import { Category } from 'src/category/entities/category.entity';
import {
  CreateProductDto,
  CreateProductMediaDto,
} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductHasCategory } from './entities/product-has-category.entity';
import { ProductHasMedia } from './entities/product-has-media.entity';
import { Product } from './entities/product.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productRepository: typeof Product,
    @Inject(PRODUCT_HAS_CATEGORY_REPOSITORY)
    private readonly productCategoryRepository: typeof ProductHasCategory,
    @Inject(PRODUCT_HAS_MEDIA_REPOSITORY)
    private readonly productMediaRepository: typeof ProductHasMedia,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  private toAbsoluteUploadPath(filename: string) {
    return `/uploads/${filename}`;
  }

  private normalizeKeepMediaIds(keepMediaIds?: number[] | string): number[] {
    if (!keepMediaIds) {
      return [];
    }

    if (Array.isArray(keepMediaIds)) {
      return keepMediaIds
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));
    }

    if (typeof keepMediaIds === 'string') {
      const parsed = keepMediaIds.trim();

      if (!parsed) {
        return [];
      }

      try {
        const json = JSON.parse(parsed);
        if (Array.isArray(json)) {
          return json.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
        }
      } catch {
        return parsed
          .split(',')
          .map((id) => Number(id.trim()))
          .filter((id) => !Number.isNaN(id));
      }
    }

    return [];
  }

  private normalizeCategories(categories?: number[] | string): number[] {
    if (!categories) {
      return [];
    }

    if (Array.isArray(categories)) {
      return categories
        .map((categoryId) => Number(categoryId))
        .filter((categoryId) => !Number.isNaN(categoryId));
    }

    if (typeof categories === 'string') {
      try {
        const parsed = JSON.parse(categories);
        return Array.isArray(parsed)
          ? parsed
              .map((categoryId) => Number(categoryId))
              .filter((categoryId) => !Number.isNaN(categoryId))
          : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  private normalizeDtoMedias(medias?: CreateProductMediaDto[] | string) {
    if (!medias) {
      return [];
    }

    if (Array.isArray(medias)) {
      return medias;
    }

    if (typeof medias === 'string') {
      try {
        const parsed = JSON.parse(medias);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  private mapUploadedFilesToMedia(files: Express.Multer.File[]) {
    return files.map((file) => ({
      path: this.toAbsoluteUploadPath(file.filename),
      filename: file.filename,
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      size: file.size,
    }));
  }

  async create(
    createProductDto: CreateProductDto,
    user: { id: number },
    files: Express.Multer.File[] = [],
  ) {
    const categoryIds = this.normalizeCategories(createProductDto.categories);
    const dtoMedias = this.normalizeDtoMedias(createProductDto.medias);
    const fileMedias = this.mapUploadedFilesToMedia(files);
    const medias = [...dtoMedias, ...fileMedias];

    if (!categoryIds.length) {
      throw new BadRequestException('At least one category is required');
    }

    const slug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
    });

    const checkProductExists = await this.findBySlug(slug);

    if (checkProductExists) {
      throw new BadRequestException('Product with this name already exists');
    }

    const data = await this.sequelize.transaction(async (transaction) => {
      const product = await this.productRepository.create(
        {
          name: createProductDto.name,
          slug,
          description: createProductDto.description,
          price: Number(createProductDto.price),
        } as any,
        { transaction },
      );

      await this.productCategoryRepository.bulkCreate(
        categoryIds.map((categoryId) => ({
          productId: product.id,
          categoryId,
        })) as any,
        { transaction },
      );

      if (medias.length) {
        await this.productMediaRepository.bulkCreate(
          medias.map((media) => ({
            productId: product.id,
            path: media.path,
            filename: media.filename,
            type: media.type,
            size: Number(media.size),
            createdBy: user.id,
          })) as any,
          { transaction },
        );
      }

      return product;
    });

    return {
      message: 'Product created successfully',
      data: await this.findOne(data.id),
    };
  }

  async findAll() {
    const data = await this.productRepository.findAll({
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
          attributes: ['id', 'path', 'filename', 'type', 'size'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return data;
  }

  async findOne(id: number) {
    const data = await this.productRepository.findOne({
      where: { id },
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
          attributes: ['id', 'path', 'filename', 'type', 'size'],
        },
      ],
    });

    if (!data) {
      throw new BadRequestException('Product not found');
    }

    return data;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: { id: number },
    files: Express.Multer.File[] = [],
  ) {
    await this.findOne(id);

    const categoriesProvided = updateProductDto.categories !== undefined;
    const keepMediaIdsProvided = updateProductDto.keepMediaIds !== undefined;

    const categoryIds = categoriesProvided
      ? this.normalizeCategories(updateProductDto.categories)
      : [];
    const keepMediaIds = keepMediaIdsProvided
      ? this.normalizeKeepMediaIds(updateProductDto.keepMediaIds)
      : [];

    const dtoMedias = this.normalizeDtoMedias(updateProductDto.medias);
    const fileMedias = this.mapUploadedFilesToMedia(files);
    const medias = [...dtoMedias, ...fileMedias];

    await this.sequelize.transaction(async (transaction) => {
      const payload: any = {};

      if (updateProductDto.name) {
        payload.name = updateProductDto.name;
        payload.slug = slugify(updateProductDto.name, {
          lower: true,
          strict: true,
        });
      }

      if (updateProductDto.description !== undefined) {
        payload.description = updateProductDto.description;
      }

      if (updateProductDto.price !== undefined) {
        payload.price = Number(updateProductDto.price);
      }

      await this.productRepository.update(payload, {
        where: { id },
        transaction,
      });

      if (categoriesProvided) {
        await this.productCategoryRepository.destroy({
          where: { productId: id },
          force: true,
          transaction,
        });

        if (categoryIds.length) {
          await this.productCategoryRepository.bulkCreate(
            categoryIds.map((categoryId) => ({
              productId: id,
              categoryId,
            })) as any,
            { transaction },
          );
        }
      }

      if (keepMediaIdsProvided) {
        if (keepMediaIds.length) {
          await this.productMediaRepository.destroy({
            where: {
              productId: id,
              id: {
                [Op.notIn]: keepMediaIds,
              },
            },
            force: true,
            transaction,
          });
        } else {
          await this.productMediaRepository.destroy({
            where: { productId: id },
            force: true,
            transaction,
          });
        }
      }

      if (medias.length) {
        await this.productMediaRepository.bulkCreate(
          medias.map((media) => ({
            productId: id,
            path: media.path,
            filename: media.filename,
            type: media.type,
            size: Number(media.size),
            createdBy: user.id,
          })) as any,
          { transaction },
        );
      }
    });

    return {
      message: 'Product updated successfully',
      data: await this.findOne(id),
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.sequelize.transaction(async (transaction) => {
      await this.productCategoryRepository.destroy({
        where: { productId: id },
        force: true,
        transaction,
      });

      await this.productMediaRepository.destroy({
        where: { productId: id },
        force: true,
        transaction,
      });

      await this.productRepository.destroy({
        where: { id },
        transaction,
      });
    });

    return { message: 'Product removed successfully' };
  }

  async findBySlug(slug: string) {
    return await this.productRepository.findOne({
      where: {
        slug,
      },
    });
  }

  async productSold() {
    return await this.productRepository.findAll({
      attributes: [
        'id',
        'name',
        [fn('COALESCE', fn('SUM', col('orderItems.quantity')), 0), 'totalSold'],
      ],
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: [],
          required: true,
        },
      ],
      group: ['Product.id', 'Product.name'],
      limit: 10,
      subQuery: false,
    });
  }
}
