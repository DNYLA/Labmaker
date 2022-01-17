import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDetails } from '../../auth/userDetails.dto';
import { CurrentUser } from '../../utils/decorators';
import { JwtAuthGuard } from '../../auth/guards/Jwt.guard';
import { DiscordService } from '../services/discord.service';
import { PartialGuild } from '../../utils/types';

@Controller('discord/guilds')
export class DiscordController {
  constructor(private readonly guildService: DiscordService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getGuilds(@CurrentUser() user: UserDetails): Promise<PartialGuild[]> {
    return this.guildService.fetchGuilds(user);
  }
}
