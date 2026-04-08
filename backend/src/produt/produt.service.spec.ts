import { Test, TestingModule } from '@nestjs/testing';
import { ProdutService } from './produt.service';

describe('ProdutService', () => {
  let service: ProdutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutService],
    }).compile();

    service = module.get<ProdutService>(ProdutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
