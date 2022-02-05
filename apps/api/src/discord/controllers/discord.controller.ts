import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserDetails } from '../../utils/types';
import { CurrentUser } from '../../utils/decorators';
import { JwtAuthGuard } from '../../auth/guards/Jwt.guard';
import { DiscordService } from '../services/discord.service';
import {
  PartialGuild,
  PartialGuildChannel,
  PartialRole,
} from '@labmaker/shared';

@Controller('discord')
export class DiscordController {
  constructor(private readonly guildService: DiscordService) {}

  @Get('/guilds')
  @UseGuards(JwtAuthGuard)
  async getGuilds(@CurrentUser() user: UserDetails): Promise<PartialGuild[]> {
    return this.guildService.fetchGuilds(user);
  }

  @Get('/:guildId/channels')
  @UseGuards(JwtAuthGuard)
  async getChannels(
    @Param('guildId') guildId: string,
    @CurrentUser() user: UserDetails
  ): Promise<PartialGuildChannel[]> {
    return this.guildService.fetchGuildChannels(guildId);
  }

  @Get('/:guildId/roles')
  @UseGuards(JwtAuthGuard)
  async getRoles(
    @Param('guildId') guildId: string,
    @CurrentUser() user: UserDetails
  ): Promise<PartialRole[]> {
    return await this.guildService.fetchGuildRoles(guildId);
  }
}
