import { Module } from '@nestjs/common';
import { GuildController } from './controllers/guild.controller';
import { GuildService } from './services/guild.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { PaymentController } from '../guilds/controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { DiscordModule } from '../discord/discord.module';
import { WebsocketModule } from '../websockets/websocket.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [DiscordModule, LogsModule, WebsocketModule],
  controllers: [GuildController, TicketController, PaymentController],
  providers: [GuildService, TicketService, PaymentService],
  exports: [PaymentService],
})
export class GuildsModule {}
