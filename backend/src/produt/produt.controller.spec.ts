import { Test, TestingModule } from '@nestjs/testing';
import { ProdutController } from './produt.controller';
import { ProdutService } from './produt.service';

describe('ProdutController', () => {
  let controller: ProdutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutController],
      providers: [ProdutService],
    }).compile();

    controller = module.get<ProdutController>(ProdutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
