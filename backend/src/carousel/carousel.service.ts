import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { Carousel } from './entities/carousel.entity';
import { CAROUSEL_REPOSITORY } from '../../constants';

@Injectable()
export class CarouselService {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepository: typeof Carousel,
  ) {}

  async create(
    createCarouselDto: CreateCarouselDto,
    files: Express.Multer.File[],
    user: any,
  ) {
    const check = await this.carouselRepository.findOne({
      where: { label: createCarouselDto.label },
    });

    if (check) {
      throw new BadRequestException('Carousel with this label already exists');
    }

    const data = await this.carouselRepository.create({
      ...createCarouselDto,
      imageUrl: `/${files[0].path.replace(/\\/g, '/').replace(/^\/?/, '')}`,
      createdBy: user.id,
    } as any as Carousel);

    return data;
  }

  async findAll() {
    return await this.carouselRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    return await this.carouselRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateCarouselDto: UpdateCarouselDto,
    files: Express.Multer.File[] = [],
  ) {
    const carousel = await this.findOne(id);

    if (!carousel) {
      throw new BadRequestException('Carousel not found');
    }

    if (files.length > 0) {
      updateCarouselDto.imageUrl = `/${files[0].path.replace(/\\/g, '/').replace(/^\/?/, '')}`;
    }

    await this.carouselRepository.update(updateCarouselDto, {
      where: { id },
    });

    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.carouselRepository.destroy({ where: { id } });
  }
}
