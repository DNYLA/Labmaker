import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto, AdminUser, UserDetails } from '../utils/types';
import { DiscordHttpService } from '../discord/services/discord-http.service';
import { ClientApplications, RedditConfig, User } from '@prisma/client';
import { UserRole } from '@labmaker/wrapper';
import { CreateClient, UpdateClient } from './client.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService // private discordHttpService: DiscordHttpService
  ) {}
  private logger = new Logger(UserService.name);

  async getLocalUser(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  /**
   * Get the user from the database, and fetch the extra nodes from the database.
   */
  async getUser(id: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    //Add Redis caching to add delays between refetching user. E.G cache when last fetched
    //Or Just store in DB?
    //Move to AUTH?????
    // const { data: discordUser } = await this.discordHttpService.fetchUser(
    //   user.accessToken
    // );

    // return await this.prismaService.user.update({
    //   where: { id: discordUser.id },
    //   data: {
    //     username: discordUser.username,
    //     discriminator: discordUser.discriminator,
    //     avatar: discordUser.avatar,
    //   },
    //   //Student|TutorTickets Currently Not Fetched but this might just be an easier way of displaying user
    //   //Tickets means less fetching?
    //   select: {
    //     id: true,
    //     username: true,
    //     discriminator: true,
    //     avatar: true,
    //     role: true,
    //     subjects: true,
    //   },
    // });

    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        discriminator: true,
        avatar: true,
        role: true,
        subjects: true,
      },
    });
  }

  async getAdminUser(id: string): Promise<AdminUser> {
    //Add Redis caching to add delays between refetching Discord Data. E.G cache when last fetched
    //Or Just store in DB?
    // const { data: discordUser } = await this.discordHttpService.fetchUser(
    //   user.accessToken
    // );

    // const updatedUser = await this.prismaService.user.update({
    //   where: { id: discordUser.id },
    //   data: {
    //     username: discordUser.username,
    //     discriminator: discordUser.discriminator,
    //     avatar: discordUser.avatar,
    //   },
    //   select: {
    //     id: true,
    //     username: true,
    //     discriminator: true,
    //     avatar: true,
    //     nodes: true,
    //     role: true,
    //   },
    // });

    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        discriminator: true,
        avatar: true,
        nodes: true,
        role: true,
      },
    });
    const userNodes = await this.fetchExtraNodes(user.id, user.nodes);

    return { ...user, nodes: userNodes };
  }

  private async fetchExtraNodes(id: string, curNodes: RedditConfig[]) {
    const extraNodes = await this.prismaService.redditConfig.findMany({
      where: { nodeEditors: { has: id } },
    });

    //Ensures Duplicate Nodes arent sent. (This is already handled on the client side + API endpoiint for updating but its better)
    //To be safe if its only one line to check.
    return [...new Set(curNodes)].concat(extraNodes);
  }

  // private async updateDiscordDetails() {}

  async getAdminUserDetails(id: string): Promise<AdminUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { nodes: true },
    });
    user.nodes = await this.fetchExtraNodes(user.id, user.nodes);

    return user;
  }

  async validNode(user: UserDetails, nodeId: number) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.BOT &&
      user.role !== UserRole.SUPERADMIN
    )
      return false;

    if (user.role === UserRole.BOT) return; //We Trust Anything from a JWT bot Token as they are allowed acess to any data.

    const fetchedUser = await this.getAdminUser(user.id);
    const node = fetchedUser.nodes.filter((n) => n.id === nodeId);
    if (!node) return false;

    return true;
  }

  async getClients(user: UserDetails): Promise<ClientApplications[]> {
    if (user.role !== 'SUPERADMIN') throw new ForbiddenException();

    return await this.prismaService.clientApplications.findMany();
  }

  async createClient(
    client: CreateClient,
    user: UserDetails
  ): Promise<ClientApplications> {
    if (user.role !== 'SUPERADMIN') throw new ForbiddenException();

    return await this.prismaService.clientApplications.create({
      data: { ...client, creatorId: user.id },
    });
  }

  async updateClient(
    client: UpdateClient,
    user: UserDetails
  ): Promise<ClientApplications> {
    if (user.role !== 'SUPERADMIN') throw new ForbiddenException();

    return await this.prismaService.clientApplications.update({
      where: { clientId: client.clientId },
      data: client,
    });
  }
}
