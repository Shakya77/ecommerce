import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { AllowedRoles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @AllowedRoles(Roles.CUSTOMER)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Request() req) {
    return this.cartService.create(createCartDto, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    return await this.cartService.findAll(req.user);
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return await this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.cartService.remove(+id);
  }

  @Get('/count')
  async cartCount(@Request() req) {
    return await this.cartService.cartCount(req.user);
  }
}
