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
  Query,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AllowedRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@AllowedRoles(Roles.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard) // Add appropriate guards here
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return await this.categoryService.create(createCategoryDto, req.user);
  }

  @Get('/list')
  async findList(@Request() req, @Query('query') query: string) {
    return await this.categoryService.findList(query);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('isActive') isActive: boolean,
  ) {
    return await this.categoryService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      req.user,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }

  @Put(':id/status')
  async changeStatus(@Param('id') id: string) {
    return await this.categoryService.changeStatus(+id);
  }
}
