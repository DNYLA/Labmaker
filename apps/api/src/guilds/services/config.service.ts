import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateConfigDto } from '../dtos/create-guildconfig.dto';
import { DiscordConfig, Payment } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../auth/userDetails.dto';
import { PaymentService } from './payment.service';
import { UserRole } from '@labmaker/wrapper';

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
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.BOT)
      throw new ForbiddenException();
    const config = await this.prismaService.discordConfig.findUnique({
      where: { id },
    });

    // if (!config) return this.createConfigFromId(id);
    if (!config) throw new NotFoundException('Unable to find config');
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

  async createConfig(id: string, name: string): Promise<DiscordConfig> {
    return await this.prismaService.discordConfig.create({
      data: { id, name, paymentConfigId: id },
    });
  }

  async updateConfig(updateConfigDto: CreateConfigDto): Promise<DiscordConfig> {
    return await this.prismaService.discordConfig.update({
      where: { id: updateConfigDto.id },
      data: updateConfigDto,
    });
  }
}
