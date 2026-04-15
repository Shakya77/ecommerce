import { Controller, Get, Param } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('products')
  async getProducts() {
    return await this.appService.getProducts();
  }

  @Public()
  @Get('products/:slug')
  async getProductDetail(@Param('slug') slug: string) {
    return await this.appService.getProductDetail(slug);
  }

  @Public()
  @Get('categories')
  async getCategories() {
    return await this.appService.getCategories();
  }
}
