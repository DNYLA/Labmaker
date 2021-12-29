import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserDetails } from '../../auth/userDetails.dto';
import { Guild } from '../dtos/Guild.dto';
import { CurrentUser } from '../../utils/getUser.decorator';
import { JwtAuthGuard } from '../../auth/guards/Jwt.guard';
import { GuildsService } from '../services/guilds.service';

@Controller('discord/guilds')
export class GuildsController {
  constructor(private readonly guildService: GuildsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getGuilds(@CurrentUser() user: UserDetails): Promise<Guild[]> {
    return this.guildService.fetchGuilds(user);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getLocalData(@Param('id') id: string) {
    return this.guildService.getLocalData(id);
  }
}
