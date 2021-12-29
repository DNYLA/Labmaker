import { Module } from '@nestjs/common';
import { ConfigController } from './controllers/config.controller';
import { ConfigService } from './services/config.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { GuildsController } from './controllers/guilds.controller';
import { GuildsService } from './services/guilds.service';

@Module({
  imports: [UserModule, HttpModule],
  controllers: [
    ConfigController,
    TicketController,
    PaymentController,
    GuildsController,
  ],
  providers: [ConfigService, TicketService, PaymentService, GuildsService],
})
export class DiscordModule {}
