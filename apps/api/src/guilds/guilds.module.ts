import { Module } from '@nestjs/common';
import { ConfigController } from '../guilds/controllers/config.controller';
import { ConfigService } from '../guilds/services/config.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { PaymentController } from '../guilds/controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [ConfigController, TicketController, PaymentController],
  providers: [ConfigService, TicketService, PaymentService],
  exports: [PaymentService],
})
export class GuildsModule {}
