import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { Promo } from './entities/promo.entity';
import { PROMO_REPOSITORY } from '../../constants';

@Injectable()
export class PromoService {
  constructor(
    @Inject(PROMO_REPOSITORY)
    private readonly promoRepository: typeof Promo,
  ) {}

  async create(createPromoDto: CreatePromoDto) {
    const existingPromo = await this.promoRepository.findOne({
      where: { code: createPromoDto.code },
    });

    if (existingPromo) {
      throw new BadRequestException('Promo code already exists');
    }

    return await this.promoRepository.create(createPromoDto as any as Promo);
  }

  async findAll() {
    return await this.promoRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    const promo = await this.promoRepository.findOne({ where: { id } });

    if (!promo) {
      throw new BadRequestException('Promo not found');
    }

    return promo;
  }

  async update(id: number, updatePromoDto: UpdatePromoDto) {
    const promo = await this.findOne(id);

    if (!promo) {
      throw new BadRequestException('Promo not found');
    }

    if (updatePromoDto.code && updatePromoDto.code !== promo.code) {
      const existingPromo = await this.promoRepository.findOne({
        where: { code: updatePromoDto.code },
      });

      if (existingPromo) {
        throw new BadRequestException('Promo code already exists');
      }
    }

    await this.promoRepository.update(updatePromoDto as any as Promo, {
      where: { id },
    });

    return await this.findOne(id);
  }

  async remove(id: number) {
    const promo = await this.findOne(id);

    if (!promo) {
      throw new BadRequestException('Promo not found');
    }

    await this.promoRepository.destroy({ where: { id } });

    return { message: 'Promo deleted successfully' };
  }

  async getByCode(code: string) {
    const promo = await this.promoRepository.findOne({
      where: { isActive: true, code },
      attributes: ['id', 'title', 'promoType', 'code', 'value'],
    });

    if (!promo) {
      throw new BadRequestException('Promo not found');
    }

    return promo;
  }

  async onStatus(id: number) {
    const promo = await this.findOne(id);

    if (!promo) {
      throw new BadRequestException('Promo not found');
    }

    const newStatus = !promo.isActive;

    await this.promoRepository.update(
      { isActive: newStatus },
      { where: { id } },
    );

    return {
      message: `${promo.title} Promo is ${newStatus ? '' : 'not'} active`,
    };
  }
}
