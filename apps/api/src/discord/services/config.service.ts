import { Injectable, Logger } from '@nestjs/common';
import { CreateConfigDto } from '../dtos/create-guildconfig.dto';
import { UpdateConfigDto } from '../dtos/update-guildconfig.dto';
import { DiscordConfig } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../utils/getUser.decorator';
import { UserDetails } from '../../auth/userDetails.dto';

@Injectable()
export class ConfigService {
  constructor(private prismaService: PrismaService) {}
  private readonly logger = new Logger(ConfigService.name);

  async getConfig(id: string, user: UserDetails): Promise<DiscordConfig> {
    //Authorization Requires More information (need to call discord API )
    //And see if user can access server
    const config = await this.prismaService.discordConfig.findUnique({
      where: { id },
    });

    if (!config) {
      return this.createConfigFromId(id);
    }

    return config;
  }

  async getConfigs(): Promise<DiscordConfig[]> {
    return await this.prismaService.discordConfig.findMany();
  }

  async createConfig(newConfig: CreateConfigDto): Promise<DiscordConfig> {
    //Not Sure Why this is here Move Over to Client Side
    newConfig.paymentConfigId = newConfig.id;
    this.logger.log('Attempting to Create New Server Config');
    return await this.prismaService.discordConfig.create({ data: newConfig });
  }

  private async createConfigFromId(id: string) {
    return await this.prismaService.discordConfig.create({
      data: { id, paymentConfigId: id },
    });
  }

  async updateConfig(updateConfigDto: CreateConfigDto): Promise<any> {
    return await this.prismaService.discordConfig.update({
      where: { id: updateConfigDto.id },
      data: updateConfigDto,
    });
  }
}
