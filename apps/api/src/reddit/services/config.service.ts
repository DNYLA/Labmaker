import { RedditConfig } from '.prisma/client';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { WebsocketGateway } from '../../websockets/socket';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConfigDto,
  UpdateConfigDto,
} from '../dtos/create-redditconfig.dto';
import { UserDetails } from '../../auth/userDetails.dto';
import { UserService } from '../../user/user.service';
import { UserRole } from '@labmaker/wrapper';

@Injectable()
export class ConfigService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private wsGateway: WebsocketGateway
  ) {}
  private readonly logger = new Logger(ConfigService.name);

  async getConfig(id: number, userDetails: UserDetails): Promise<RedditConfig> {
    await this.userService.validNode(userDetails, id);
    return await this.prismaService.redditConfig.findUnique({ where: { id } });
  }

  async getConfigs(): Promise<RedditConfig[]> {
    return await this.prismaService.redditConfig.findMany();
  }

  /**
   * Create a new config.
   * @param {CreateConfigDto} newConfig - CreateConfigDto: The data to create the config with.
   * @returns A new config object.
   */
  async createConfig(
    newConfig: CreateConfigDto,
    user: UserDetails
  ): Promise<RedditConfig> {
    if (user.id !== UserRole.ADMIN) throw new ForbiddenException();

    const config = await this.prismaService.redditConfig.create({
      data: newConfig,
    });
    this.wsGateway.newConfig(config);

    return config;
  }

  /**
   * Update the config for a subreddit.
   * @param {UpdateConfigDto} ucd - UpdateConfigDto
   * @returns The updated config.
   */
  async updateConfig(
    config: UpdateConfigDto,
    user: UserDetails
  ): Promise<RedditConfig | undefined> {
    await this.userService.validNode(user, config.id);

    const editors = config.nodeEditors.filter(
      (userId) => userId !== config.userId
    );
    config.nodeEditors = [...new Set(editors)]; //Dont store Duplicates

    const updatedConfig = await this.prismaService.redditConfig.update({
      where: { id: config.id },
      data: config,
    });
    if (!updatedConfig) throw new NotFoundException('Unable to locate config');

    this.wsGateway.notifyConfig(updatedConfig);
    return updatedConfig;
  }

  /**
   * delete a config.
   * @param {number} id - number - The id of the config to delete.
   * @returns The deleted config.
   */
  async deleteConfig(id: number, user: UserDetails): Promise<RedditConfig> {
    await this.userService.validNode(user, id);

    const config = await this.prismaService.redditConfig.delete({
      where: { id },
    });
    this.wsGateway.deleteConfig(id.toString());
    return config;
  }
}
