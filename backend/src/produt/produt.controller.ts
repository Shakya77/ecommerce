import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutService } from './produt.service';
import { CreateProdutDto } from './dto/create-produt.dto';
import { UpdateProdutDto } from './dto/update-produt.dto';

@Controller('produt')
export class ProdutController {
  constructor(private readonly produtService: ProdutService) {}

  @Post()
  create(@Body() createProdutDto: CreateProdutDto) {
    return this.produtService.create(createProdutDto);
  }

  @Get()
  findAll() {
    return this.produtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutDto: UpdateProdutDto) {
    return this.produtService.update(+id, updateProdutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtService.remove(+id);
  }
}
