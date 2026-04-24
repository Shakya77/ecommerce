import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PromoService } from './promo.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowedRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createPromoDto: CreatePromoDto) {
    return await this.promoService.create(createPromoDto);
  }

  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll() {
    return await this.promoService.findAll();
  }

  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.promoService.findOne(+id);
  }

  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromoDto: UpdatePromoDto,
  ) {
    return await this.promoService.update(+id, updatePromoDto);
  }

  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.promoService.remove(+id);
  }

  @Get('getByCode/:code')
  async getByCode(@Param('code') code: string) {
    return await this.promoService.getByCode(code);
  }
  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('status/:id')
  async onStatus(@Param('id') id: string) {
    return await this.promoService.onStatus(+id);
  }
}
