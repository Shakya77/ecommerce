import { Module } from '@nestjs/common';
import { ProdutService } from './produt.service';
import { ProdutController } from './produt.controller';

@Module({
  controllers: [ProdutController],
  providers: [ProdutService],
})
export class ProdutModule {}
