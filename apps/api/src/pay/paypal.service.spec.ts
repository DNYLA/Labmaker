import { Test, TestingModule } from '@nestjs/testing';
import { PayPalService } from './paypal.service';

describe('PayService', () => {
  let service: PayPalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayPalService],
    }).compile();

    service = module.get<PayPalService>(PayPalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
