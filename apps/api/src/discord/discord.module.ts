import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscordController } from './controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { DiscordHttpService } from './services/discord-http.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [DiscordController],
  providers: [DiscordService, DiscordHttpService],
  exports: [DiscordHttpService],
})
export class DiscordModule {}
