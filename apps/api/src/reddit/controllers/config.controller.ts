import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RedditConfig } from '@prisma/client';
import { UserDetails } from '../../auth/userDetails.dto';
import { CurrentUser } from '../../utils/decorators';
import { JwtAuthGuard, JwtBotAuthGuard } from '../../auth/guards/Jwt.guard';
import {
  CreateConfigDto,
  UpdateConfigDto,
} from '../dtos/create-redditconfig.dto';
import { ConfigService } from '../services/config.service';

@Controller('reddit')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getConfig(
    @Param('id') id: number,
    @CurrentUser() user: UserDetails
  ): Promise<RedditConfig> {
    return this.configService.getConfig(id, user);
  }

  @Get('')
  @UseGuards(JwtBotAuthGuard)
  getAll(): Promise<RedditConfig[]> {
    return this.configService.getConfigs();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createConfig(
    @Body() body: CreateConfigDto,
    @CurrentUser() user: UserDetails
  ): Promise<RedditConfig> {
    return this.configService.createConfig(body, user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateConfig(
    @Body() body: UpdateConfigDto,
    @CurrentUser() user: UserDetails
  ) {
    return this.configService.updateConfig(body, user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteConfig(@Param('id') id: number, @CurrentUser() user: UserDetails) {
    return this.configService.deleteConfig(id, user);
  }
}
