import { Injectable, Logger } from '@nestjs/common';
import { CreateConfigDto } from '../dtos/create-guildconfig.dto';
import { DiscordConfig, Payment } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../auth/userDetails.dto';
import { PaymentService } from './payment.service';

export interface LocalData {
  config: DiscordConfig;
  payments: Payment[];
}

@Injectable()
export class ConfigService {
  constructor(
    private prismaService: PrismaService,
    private paymentService: PaymentService
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
    user: UserDetails
  ): Promise<DiscordConfig | LocalData> {
    //Add Authorization to see if user has access to this data. ( This can be done via fetching mutual guilds )
    console.log(user);
    const config = await this.prismaService.discordConfig.findUnique({
      where: { id },
    });

    if (!config) return this.createConfigFromId(id);
    if (!payments) return config;

    const fetchedPayments = await this.paymentService.getPayments(id);
    return {
      config,
      payments: fetchedPayments,
    };
  }

  async getConfigs(): Promise<DiscordConfig[]> {
    return await this.prismaService.discordConfig.findMany();
  }

  /**
   * Create a new Discord Config
   * @param {CreateConfigDto} newConfig - CreateConfigDto
   * @returns A DiscordConfig Object
   */
  async createConfig(newConfig: CreateConfigDto): Promise<DiscordConfig> {
    //Not Sure Why this is here Move Over to Client Side
    newConfig.paymentConfigId = newConfig.id;
    return await this.prismaService.discordConfig.create({ data: newConfig });
  }

  /**
   * Create a new Discord configuration for a payment.
   * @param {string} id - The id of the payment config to create.
   * @returns The `DiscordConfig` object.
   */
  private async createConfigFromId(id: string) {
    return await this.prismaService.discordConfig.create({
      data: { id, paymentConfigId: id },
    });
  }

  /**
   * Update the Discord configuration.
   * @param {CreateConfigDto} updateConfigDto - CreateConfigDto
   * @returns The updated DiscordConfig object.
   */
  async updateConfig(updateConfigDto: CreateConfigDto): Promise<DiscordConfig> {
    return await this.prismaService.discordConfig.update({
      where: { id: updateConfigDto.id },
      data: updateConfigDto,
    });
  }
}
