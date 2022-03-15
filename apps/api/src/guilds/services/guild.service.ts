import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationResult, DiscordConfig, ResponseType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../utils/types';
import { PaymentService } from './payment.service';
import { UserRole } from '@labmaker/wrapper';
import { WebsocketGateway } from '../../websockets/socket';
import { UpdateConfigDto } from '../dtos/create-guildconfig.dto';
import { GuildData, PartialGuildChannel, PartialRole } from '@labmaker/shared';
import { DiscordHttpService } from '../../discord/services/discord-http.service';
import { CreateApplicationDTO } from '../dtos/apply-tutor.dto';
import { UserLogsService } from '../../logs/logs.service';

@Injectable()
export class GuildService {
  constructor(
    private prismaService: PrismaService,
    private paymentService: PaymentService,
    private discordHttpService: DiscordHttpService,
    private userLogs: UserLogsService,
    private wsGateway: WebsocketGateway
  ) {}
  private readonly logger = new Logger(GuildService.name);
  /**
   * Gets Guild Config
   * @param {string} id - string,
   * @param {UserDetails} user - UserDetails
   * @returns DiscordConfig
   */
  //Realistically this should be two seperate EndPoints since this can return two types
  async getConfig(
    id: string,
    payments: boolean,
    guildInfo: boolean,
    user: UserDetails
  ): Promise<DiscordConfig | GuildData> {
    //Add Authorization to see if user has access to this data. ( This can be done via fetching mutual guilds )
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.BOT) {
      this.submitLog(user, id, 'FORBIDDEN', 0);
      throw new ForbiddenException();
    }

    let config = await this.prismaService.discordConfig.findUnique({
      where: { id },
    });

    if (!config) {
      this.submitLog(
        user,
        id,
        'COMPLETED',
        undefined,
        'Created missing discord config'
      );

      const guild = (await this.discordHttpService.fetchGuildById(id)).data;
      config = await this.createConfig(id, guild.name);
    }

    if (!payments) {
      this.submitLog(user, id);
      return config;
    }

    let channels: PartialGuildChannel[] = [];
    let roles: PartialRole[] = [];

    if (guildInfo) {
      channels = (await this.discordHttpService.fetchGuildChannels(config.id))
        .data;
      roles = (await this.discordHttpService.fetchGuildRoles(config.id)).data;
      channels;
    }

    const fetchedPayments = await this.paymentService.getPayments(id);
    this.submitLog(user, id);
    return {
      config,
      channels,
      roles,
      payments: fetchedPayments,
    };
  }

  async getConfigs(): Promise<DiscordConfig[]> {
    //Add Logging
    return await this.prismaService.discordConfig.findMany();
  }

  async createConfig(id: string, name: string): Promise<DiscordConfig> {
    //Add Logging
    return await this.prismaService.discordConfig.create({
      data: { id, name, paymentConfigId: id },
    });
  }

  async updateConfig(
    config: UpdateConfigDto,
    user: UserDetails
  ): Promise<DiscordConfig> {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.BOT) {
      this.submitLog(user, config.id, 'FORBIDDEN', 0);
      throw new ForbiddenException();
    }
    const c = await this.prismaService.discordConfig.update({
      where: { id: config.id },
      data: config,
    });
    if (user.role !== UserRole.BOT) this.wsGateway.notifyGuildConfig(c);
    this.submitLog(user, config.id);
    return c;
  }

  async canApply(user: UserDetails) {
    if (user.role !== UserRole.USER) {
      this.submitLog(user, 'SERVER_ID', 'FORBIDDEN', 0, 'User Already Tutor'); //Change SERVER_ID to actual serverID
      throw new ForbiddenException();
    }

    const date = new Date();
    date.setDate(date.getDate() - 7);

    const applications = await this.prismaService.applications.findMany({
      where: {
        userId: user.id,
        OR: [{ createdAt: { gte: date } }, { reviewedAt: null }],
      },
    });

    this.submitLog(user, 1);
    if (applications.length > 0) return false;
    return true;
  }

  async applyTutor(
    serverId: string,
    application: CreateApplicationDTO,
    user: UserDetails
  ) {
    //Some people may manually make requests to EndPoint so we re-check if they can apply
    //On API aswell
    const canApply = await this.canApply(user);
    if (!canApply) {
      this.submitLog(
        user,
        serverId,
        'FORBIDDEN',
        0,
        `Application Already Pending`
      );
      throw new ForbiddenException();
    }
    await this.prismaService.applications.create({
      data: {
        ...application,
        serverId,
        userId: user.id,
        createdAt: new Date(),
      },
    });
    this.submitLog(user, 1);
    return HttpStatus.OK;
  }

  async getApplications(serverId: string, user: UserDetails) {
    if (user.role !== UserRole.ADMIN) {
      this.submitLog(user, serverId, 'FORBIDDEN', 0);
      throw new ForbiddenException();
    }

    const apps = await this.prismaService.applications.findMany({
      where: { serverId, reviewedAt: null },
    });
    this.submitLog(user, apps.length);
    return apps;
  }

  async getApplicationByChannelId(channelId: string, user: UserDetails) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.BOT) {
      this.submitLog(
        user,
        channelId,
        'FORBIDDEN',
        0,
        '403 Attempting to retreive application by channelId.'
      );
      throw new ForbiddenException();
    }

    const app = await this.prismaService.applications.findFirst({
      where: { channelId: channelId },
    });

    this.submitLog(
      user,
      channelId,
      'COMPLETED',
      app ? 1 : 0,
      'Successfully retreived application by channelId'
    );

    return app;
  }

  async reviewApplication(
    id: number,
    action: ApplicationResult,
    user: UserDetails
  ) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.BOT) {
      this.submitLog(user, id, 'FORBIDDEN', 0);
      throw new ForbiddenException();
    }

    let applic = await this.prismaService.applications.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!applic) {
      this.submitLog(user, id, 'NOTFOUND', 0);
      throw new NotFoundException(undefined, "Couldn't find the application!");
    }

    // Don't allow rejecting application when it has already been set to interview and vice versa.
    // Only allow this to happen when request is coming from the bot, because when reviewer clicks
    // reject button through `!review` command, we want it to actually reject the application.
    if (user.role !== 'BOT') {
      if (
        (action == 'INTERVIEW' && applic.result == 'REJECTED') ||
        (action == 'REJECTED' && applic.result == 'INTERVIEW')
      ) {
        throw new BadRequestException(
          undefined,
          `Can't change application result to ${action.toLowerCase()} when it has already been set to ${applic.result.toLowerCase()}.`
        );
      }
    }

    //Add Log Notifying that someone attempted to access this
    if (applic.result == 'ACCEPTED' || applic.result == 'REJECTED') {
      this.submitLog(user, id, 'FORBIDDEN', 0, 'Already Reviewed');
      throw new ForbiddenException(
        undefined,
        'This application has already been reviewed!'
      );
    }

    // If current application result is same as result wanting to change to.
    if (applic.result == action) {
      this.submitLog(
        user,
        id,
        'FORBIDDEN',
        0,
        'Attempted to change result to same result'
      );

      throw new BadRequestException(
        undefined,
        `Application is already set to ${action.toLowerCase()}!`
      );
    }

    // Update application with new result and reviewedAt date.
    // Also updates the `applic` var with the new application.
    applic = await this.prismaService.applications.update({
      where: { id },
      data: { result: action, reviewedAt: new Date() },
      include: { user: true },
    });

    // If application is being set to INTERVIEW result,
    // notify discord bot to create a channel for the interview.
    // If application is rejected, message applicant with the rejected app msg.
    if (action == 'INTERVIEW' || action == 'REJECTED') {
      this.wsGateway.notifyTutorApplication(applic);
    }

    this.submitLog(user, id, 'COMPLETED', 1, `${action} application ${id}`);
  }

  async ticketsEnabled(serverId: string, user: UserDetails) {
    //Cant Call this as Normal User doesnt have access
    // const config = await this.getConfig(serverId, user);

    const config = await this.prismaService.discordConfig.findUnique({
      where: { id: serverId },
    });

    if (!config) {
      this.submitLog(user, serverId, 'NOTFOUND');
      throw new NotFoundException();
    }

    this.submitLog(user, serverId);
    return config.ticketSystem;
  }

  private async submitLog(
    user: UserDetails,
    id?: number | string,
    response?: ResponseType,
    rows?: number,
    info?: string
  ) {
    this.userLogs.createLog(user, {
      componentName: 'GUILD',
      componentType: GuildService.name,
      componentId: id ? id.toString() : null,
      numRows: rows,
      information: info,
      response,
    });
  }
}
