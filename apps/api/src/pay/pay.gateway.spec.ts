import { Test, TestingModule } from '@nestjs/testing';
import { PayGateway } from './pay.gateway';

describe('PayGateway', () => {
  let gateway: PayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayGateway],
    }).compile();

    gateway = module.get<PayGateway>(PayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
