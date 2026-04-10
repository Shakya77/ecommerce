import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PRODUCTS_REPOSITORY } from '../../constants';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productRepository: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto) {

    return 'This action adds a new product';
  }

  async findAll() {
    return `This action returns all product`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
