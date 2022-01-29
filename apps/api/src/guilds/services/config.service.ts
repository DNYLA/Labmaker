import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DiscordConfig } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../auth/userDetails.dto';
import { PaymentService } from './payment.service';
import { UserRole } from '@labmaker/wrapper';
import { WebsocketGateway } from '../../websockets/socket';
import { UpdateConfigDto } from '../dtos/create-guildconfig.dto';
import { GuildData, PartialGuildChannel, PartialRole } from '@labmaker/shared';
import { DiscordHttpService } from '../../discord/services/discord-http.service';

@Injectable()
export class ConfigService {
  constructor(
    private prismaService: PrismaService,
    private paymentService: PaymentService,
    private discordHttpService: DiscordHttpService,
    private wsGateway: WebsocketGateway
  ) {}
  private readonly logger = new Logger(ConfigService.name);

  /**
   * Gets Guild Config
   * @param {string} id - string,
   * @param {UserDetails} user - UserDetails
   * @returns DiscordConfig
   */
  async getConfig(
    id: string,
    payments: boolean,
    guildInfo: boolean,
    user: UserDetails
  ): Promise<DiscordConfig | GuildData> {
    //Add Authorization to see if user has access to this data. ( This can be done via fetching mutual guilds )
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.BOT)
      throw new ForbiddenException();

    const config = await this.prismaService.discordConfig.findUnique({
      where: { id },
    });

    // if (!config) return this.createConfigFromId(id);
    if (!config) throw new NotFoundException('Unable to find config');
    if (!payments) return config;
    let channels: PartialGuildChannel[] = [];
    let roles: PartialRole[] = [];

    if (guildInfo) {
      channels = (await this.discordHttpService.fetchGuildChannels(config.id))
        .data;
      roles = (await this.discordHttpService.fetchGuildRoles(config.id)).data;
      channels;
    }
    const fetchedPayments = await this.paymentService.getPayments(id);
    return {
      config,
      channels,
      roles,
      payments: fetchedPayments,
    };
  }

  async getConfigs(): Promise<DiscordConfig[]> {
    return await this.prismaService.discordConfig.findMany();
  }

  async createConfig(id: string, name: string): Promise<DiscordConfig> {
    return await this.prismaService.discordConfig.create({
      data: { id, name, paymentConfigId: id },
    });
  }

  async updateConfig(
    config: UpdateConfigDto,
    user: UserDetails
  ): Promise<DiscordConfig> {
    const c = await this.prismaService.discordConfig.update({
      where: { id: config.id },
      data: config,
    });
    if (user.role !== UserRole.BOT) this.wsGateway.notifyGuildConfig(c);
    return c;
  }
}
