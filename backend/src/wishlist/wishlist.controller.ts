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
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { AllowedRoles } from 'src/auth/decorators/roles.decorator';

@AllowedRoles(Roles.CUSTOMER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Request() request: any,
  ) {
    return this.wishlistService.create(createWishlistDto, request.user);
  }

  @Get()
  findAll(@Request() request: any) {
    return this.wishlistService.findAll(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: any) {
    return this.wishlistService.findOne(+id, request.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: any) {
    return this.wishlistService.remove(+id, request.user);
  }
}
