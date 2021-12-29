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
import { JwtAuthGuard, JwtBotAuthGuard } from '../../auth/guards/Jwt.guard';
import {
  CreateConfigDto,
  UpdateConfigDto,
} from '../dtos/create-redditconfig.dto';
import { ConfigService } from '../services/config.service';

@Controller('reddit/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getConfig(@Param('id') id: number): Promise<RedditConfig> {
    return this.configService.getConfig(id);
  }

  @Get('')
  @UseGuards(JwtBotAuthGuard)
  getAll(): Promise<RedditConfig[]> {
    return this.configService.getConfigs();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createConfig(@Body() body: CreateConfigDto): Promise<RedditConfig> {
    return this.configService.createConfig(body);
  }

  @Put()
  updateConfig(@Body() body: UpdateConfigDto) {
    return this.configService.updateConfig(body);
  }

  @Put('/:id')
  updateMessage(@Param('id') id: number, @Body() body: any) {
    return this.configService.updateMessage(id, body.pmBody);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteConfig(@Param('id') id: number) {
    return this.configService.deleteConfig(id);
  }

  @Get('image/profile')
  getProfile(): Promise<any> {
    return this.configService.getProfile('chikybacon');
  }
}
