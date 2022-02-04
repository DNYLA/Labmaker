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
import { GuildService } from '../services/guild.service';
import { GuildData } from '@labmaker/shared';
import { CreateApplicationDTO } from '../dtos/apply-tutor.dto';

@Controller('guilds')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('/:id/')
  getConfig(
    @Param('id') id: string,
    @Query('payments') payments: boolean,
    @Query('guildInfo') guildInfo: boolean,
    @CurrentUser() user: UserDetails
  ): Promise<DiscordConfig | GuildData> {
    return this.guildService.getConfig(id, payments, guildInfo, user);
  }

  @Get()
  @UseGuards(JwtBotAuthGuard)
  async getConfigs() {
    return this.guildService.getConfigs();
  }

  @Post('/:id')
  createConfig(
    @Param('id') id: string,
    @Query('name') name: string
  ): Promise<DiscordConfig> {
    if (!name) throw new BadRequestException();
    return this.guildService.createConfig(id, name);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateConfig(
    @Body() body: UpdateConfigDto,
    @CurrentUser() user: UserDetails
  ) {
    return this.guildService.updateConfig(body, user);
  }

  //Cant Merge into one Since Creating Requires Body
  //Also One is a Get the Other is A Put (Forgot that when i made the endpoint)
  //   @UseGuards(JwtAuthGuard)
  //   @Get('/:id/apply') //For Students Applying ID = ServerID for Admins ID = ApplicationID
  //   applyTutor(
  //     @Param('id') id: string,
  //     @Query('action') action: ApplicationResult,
  //     @Body() body: CreateApplicationDTO,
  //     @CurrentUser() user: UserDetails
  //   ) {
  //     if (!action) return this.guildService.applyTutor(id, body, user);
  //     try {
  //       if (isNaN(Number(id))) throw new BadRequestException();
  //       return this.guildService.updateApplication(Number(id), action, user);
  //     } catch {
  //       throw new BadRequestException();
  //     }
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/apply')
  canApplyTutor(@CurrentUser() user: UserDetails) {
    return this.guildService.canApply(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/apply') //For Students Applying ID = ServerID for Admins ID = ApplicationID
  applyTutor(
    @Param('id') id: string,
    @Body() body: CreateApplicationDTO,
    @CurrentUser() user: UserDetails
  ) {
    return this.guildService.applyTutor(id, body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/applications')
  getApplications(@Param('id') id: string, @CurrentUser() user: UserDetails) {
    return this.guildService.getApplications(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/review') //For Students Applying ID = ServerID for Admins ID = ApplicationID
  reviewApplication(
    @Param('id') id: number,
    @Query('action') action: ApplicationResult,
    @CurrentUser() user: UserDetails
  ) {
    return this.guildService.updateApplication(id, action, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets/:id/enabled') //For Students Applying ID = ServerID for Admins ID = ApplicationID
  ticketsEnabled(@Param('id') id: string) {
    return this.guildService.ticketsEnabled(id);
  }
}
