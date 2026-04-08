import { Injectable } from '@nestjs/common';
import { CreateProdutDto } from './dto/create-produt.dto';
import { UpdateProdutDto } from './dto/update-produt.dto';

@Injectable()
export class ProdutService {
  create(createProdutDto: CreateProdutDto) {
    return 'This action adds a new produt';
  }

  findAll() {
    return `This action returns all produt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} produt`;
  }

  update(id: number, updateProdutDto: UpdateProdutDto) {
    return `This action updates a #${id} produt`;
  }

  remove(id: number) {
    return `This action removes a #${id} produt`;
  }
}
