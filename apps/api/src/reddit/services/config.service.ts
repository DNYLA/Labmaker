import { RedditConfig } from '.prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { WebsocketGateway } from '../../websockets/socket';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConfigDto,
  UpdateConfigDto,
} from '../dtos/create-redditconfig.dto';

@Injectable()
export class ConfigService {
  constructor(
    private prismaService: PrismaService,
    private wsGateway: WebsocketGateway
  ) {}
  private readonly logger = new Logger(ConfigService.name);

  async getConfig(id: number): Promise<RedditConfig> {
    return await this.prismaService.redditConfig.findUnique({
      where: {
        id,
      },
    });
  }

  async getConfigs(): Promise<RedditConfig[]> {
    return await this.prismaService.redditConfig.findMany();
  }

  async createConfig(newConfig: CreateConfigDto): Promise<RedditConfig> {
    this.logger.log(JSON.stringify(newConfig));
    try {
      const config = await this.prismaService.redditConfig.create({
        data: newConfig,
      });
      this.wsGateway.newConfig(config);

      return config;
    } catch (err) {
      this.logger.error(err);
      return;
    }
  }

  async updateConfig(ucd: UpdateConfigDto): Promise<RedditConfig | undefined> {
    const filter = { id: ucd.id };
    ucd.nodeEditors = ucd.nodeEditors.filter((userId) => userId !== ucd.userId);

    ucd.nodeEditors = [...new Set(ucd.nodeEditors)];
    const config = await this.prismaService.redditConfig.update({
      where: filter,
      data: ucd,
    });

    if (config) {
      this.wsGateway.notifyConfig(config);
      return config;
    }
  }

  async updateMessage(
    id: number,
    message: string
  ): Promise<RedditConfig | undefined> {
    const config = await this.prismaService.redditConfig.update({
      where: { id },
      data: { pmBody: message },
    });

    if (config) {
      this.wsGateway.notifyConfig(config);
      return config;
    }
  }

  async deleteConfig(id: number): Promise<RedditConfig> {
    const config = await this.prismaService.redditConfig.delete({
      where: { id },
    });
    this.wsGateway.deleteConfig(id.toString());
    return config;
  }
}
