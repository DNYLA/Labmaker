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

  /**
   * `async getConfigs(): Promise<RedditConfig[]>`
   *
   * This function returns a promise that resolves to an array of RedditConfig objects.
   * @returns A list of all the configs.
   */
  async getConfigs(): Promise<RedditConfig[]> {
    return await this.prismaService.redditConfig.findMany();
  }

  /**
   * Create a new config.
   * @param {CreateConfigDto} newConfig - CreateConfigDto: The data to create the config with.
   * @returns A new config object.
   */
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

  /**
   * Update the config for a subreddit.
   * @param {UpdateConfigDto} ucd - UpdateConfigDto
   * @returns The updated config.
   */
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

  /**
   * Update the message body of a RedditConfig.
   * @param {number} id - number
   * @param {string} message - string
   * @returns The updated config object.
   */
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

  /**
   * delete a config.
   * @param {number} id - number - The id of the config to delete.
   * @returns The deleted config.
   */
  async deleteConfig(id: number): Promise<RedditConfig> {
    const config = await this.prismaService.redditConfig.delete({
      where: { id },
    });
    this.wsGateway.deleteConfig(id.toString());
    return config;
  }
}
