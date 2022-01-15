import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateConfigDto } from '../dtos/create-guildconfig.dto';
import { DiscordConfig } from '@prisma/client';
import { JwtAuthGuard, JwtBotAuthGuard } from '../../auth/guards/Jwt.guard';
import { CurrentUser } from '../../utils/decorators';
import { UserDetails } from '../../auth/userDetails.dto';
import { ConfigService, LocalData } from '../services/config.service';

@Controller('guilds/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  private context = 'DiscordConfigController';

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('/:id/:payments')
  getConfig(
    @Param('id') id: string,
    @Param('payments') payments: boolean,
    @CurrentUser() user: UserDetails
  ): Promise<DiscordConfig | LocalData> {
    return this.configService.getConfig(id, payments, user);
  }

  @Get()
  @UseGuards(JwtBotAuthGuard)
  async getConfigs() {
    return this.configService.getConfigs();
  }

  @Post()
  createConfig(@Body() body: CreateConfigDto): Promise<DiscordConfig> {
    return this.configService.createConfig(body);
  }

  @Put()
  updateConfig(@Body() body: CreateConfigDto) {
    return this.configService.updateConfig(body);
  }
}
