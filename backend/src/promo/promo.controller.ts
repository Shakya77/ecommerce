import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromoService } from './promo.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';

@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post()
  async create(@Body() createPromoDto: CreatePromoDto) {
    return await this.promoService.create(createPromoDto);
  }

  @Get()
  async findAll() {
    return await this.promoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.promoService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromoDto: UpdatePromoDto,
  ) {
    return await this.promoService.update(+id, updatePromoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.promoService.remove(+id);
  }

  @Get('getByCode/:code')
  async getByCode(@Param('code') code: string) {
    return await this.promoService.getByCode(code);
  }
}
