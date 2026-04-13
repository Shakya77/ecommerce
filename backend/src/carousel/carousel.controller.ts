import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AllowedRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@AllowedRoles(Roles.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/carousels',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() createCarouselDto: CreateCarouselDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    return await this.carouselService.create(
      createCarouselDto,
      files || [],
      req.user,
    );
  }

  @Get()
  findAll() {
    return this.carouselService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carouselService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
  ) {
    return this.carouselService.update(+id, updateCarouselDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carouselService.remove(+id);
  }
}
