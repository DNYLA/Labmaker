import { RedditConfig } from '.prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConfigDto,
  UpdateConfigDto,
} from '../dtos/create-redditconfig.dto';
import { RedditGateway } from '../reddit.gateway';

@Injectable()
export class ConfigService {
  constructor(
    private prismaService: PrismaService,
    private readonly redditGateway: RedditGateway // @Inject(HttpService) private readonly httpService: HttpService
  ) {}
  private readonly logger = new Logger(ConfigService.name);

  async getConfig(id: number): Promise<RedditConfig> {
    //Send Back X Amount OF Logs
    //Not Sure if You can filter Logs Like This in Relationships (Could Manually Query Logs Instead?)
    // let configs =  await this.prismaService.redditConfig.findUnique({
    //   where: {
    //     id,
    //   },
    //   include: {
    //     _count: {
    //       select: {
    //         logs: true,
    //       },
    //     },
    //   },
    // });

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
      this.redditGateway.notifyConfig(config);
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
      this.redditGateway.notifyConfig(config);
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
      this.redditGateway.notifyConfig(config);
      return config;
    }
  }

  async deleteConfig(id: number): Promise<void> {
    await this.prismaService.redditConfig.delete({ where: { id } });
    this.redditGateway.notifyDelete(id);
    return;
  }
}
