import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateConfigDto } from '../dtos/create-guildconfig.dto';
import { ApplicationResult, DiscordConfig } from '@prisma/client';
import { JwtAuthGuard, JwtBotAuthGuard } from '../../auth/guards/Jwt.guard';
import { CurrentUser } from '../../utils/decorators';
import { UserDetails } from '../../auth/userDetails.dto';
import { ConfigService } from '../services/guild.service';
import { GuildData } from '@labmaker/shared';
import { CreateApplicationDTO } from '../dtos/apply-tutor.dto';

@Controller('guilds')
export class GuildController {
  constructor(private readonly configService: ConfigService) {}

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('/:id/')
  getConfig(
    @Param('id') id: string,
    @Query('payments') payments: boolean,
    @Query('guildInfo') guildInfo: boolean,
    @CurrentUser() user: UserDetails
  ): Promise<DiscordConfig | GuildData> {
    return this.configService.getConfig(id, payments, guildInfo, user);
  }

  @Get()
  @UseGuards(JwtBotAuthGuard)
  async getConfigs() {
    return this.configService.getConfigs();
  }

  @Post('/:id/:name')
  createConfig(
    @Param('id') id: string,
    @Param('name') name: string
  ): Promise<DiscordConfig> {
    return this.configService.createConfig(id, name);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateConfig(
    @Body() body: UpdateConfigDto,
    @CurrentUser() user: UserDetails
  ) {
    return this.configService.updateConfig(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/apply') //For Students Applying ID = ServerID for Admins ID = ApplicationID
  applyTutor(
    @Param('id') id: string,
    @Query('action') action: ApplicationResult,
    @Body() body: CreateApplicationDTO,
    @CurrentUser() user: UserDetails
  ) {
    if (!action) return this.configService.applyTutor(id, body, user);
    try {
      if (isNaN(Number(id))) throw new BadRequestException();
      return this.configService.updateApplication(Number(id), action, user);
    } catch {
      throw new BadRequestException();
    }
  }
}
