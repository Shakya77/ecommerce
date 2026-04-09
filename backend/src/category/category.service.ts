import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CATEGORIES_REPOSITORY } from '../../constants';
import { Category } from './entities/category.entity';
import slugify from 'slugify';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoryRepository: typeof Category,
  ) {}

  slug(name: string) {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    return slug;
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOne({
      where: {
        slug: slug,
      },
    });
  }

  async create(createCategoryDto: CreateCategoryDto, user) {
    const slug = this.slug(createCategoryDto.name);

    const existingCategory = await this.findOneBySlug(slug);

    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    const data = await this.categoryRepository.create({
      ...createCategoryDto,
      slug: slug,
      createdBy: user.id,
    } as any as Category);

    return { message: 'Category created successfully', data };
  }

  async findAll(page: number, limit: number, user) {
    const offset = (page - 1) * limit;

    const data = await this.categoryRepository.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: data.rows,
      total: data.count,
      page: page,
      limit: limit,
    };
  }

  async findOne(id: number) {
    const data = await this.categoryRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'slug',
        'description',
        'isActive',
        'createdBy',
      ],
    });

    if (!data) {
      throw new BadRequestException('Category not found');
    }

    return data;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user) {
    await this.findOne(id);

    const data = await this.categoryRepository.update(
      {
        ...updateCategoryDto,
        slug: this.slug(updateCategoryDto.name as string),
        updatedBy: user.id,
      },
      {
        where: { id },
      },
    );

    return data;
  }

  async remove(id: number) {
    await this.findOne(id);

    const data = await this.categoryRepository.destroy({
      where: { id },
    });

    return { message: 'Category removed successfully' };
  }

  async changeStatus(id: number) {
    const data = await this.categoryRepository.update(
      { isActive: !(await this.findOne(id)).isActive },
      {
        where: { id },
      },
    );

    return 'Category status changed';
  }

  async findList(query = '') {
    const data = await this.categoryRepository.findAll({
      where: {
        isActive: true,
        name: { [Op.like]: `%${query}%` },
      },
      attributes: ['id', 'name'],
    });

    return data;
  }
}
