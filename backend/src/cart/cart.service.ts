import { Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CARTS_REPOSITORY } from '../../constants';

@Injectable()
export class CartService {
  constructor(
    @Inject(CARTS_REPOSITORY)
    private readonly cartRepository: typeof Cart,
  ) {}

  async create(createCartDto: CreateCartDto, user: any) {
    const data = await this.cartRepository.create({} as any as Cart);

    return data;
  }

  async findAll() {
    return await this.cartRepository.findAll();
  }

  async findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
