import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayPalService } from './paypal.service';
import { PayGateway } from './pay.gateway';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [PayController],
  providers: [PayPalService, PayGateway],
})
export class PayModule {}
