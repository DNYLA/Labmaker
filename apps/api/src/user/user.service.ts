import { Injectable, Logger } from '@nestjs/common';
import { UserDetails } from '../auth/userDetails.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto, AdminUser } from './dto/User.dto';
import { User } from '../utils/types';
import { DiscordHttpService } from '../discord/services/discord-http.service';
import { RedditConfig } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private discordHttpService: DiscordHttpService
  ) {}
  private logger = new Logger(UserService.name);

  /**
   * Get the user from the database, and fetch the extra nodes from the database.
   */
  async getUser(userDetails: UserDetails): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userDetails.id },
    });

    //Add Redis caching to add delays between refetching user. E.G cache when last fetched
    //Or Just store in DB?
    const { data: discordUser } = await this.discordHttpService.fetchUser(
      user.accessToken
    );

    return await this.prismaService.user.update({
      where: { id: discordUser.id },
      data: {
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
      },
      //Student|TutorTickets Currently Not Fetched but this might just be an easier way of displaying user
      //Tickets means less fetching?
      select: {
        id: true,
        username: true,
        discriminator: true,
        avatar: true,
        role: true,
        verifiedSubjects: true,
      },
    });
  }

  async getAdminUser(userDetails: UserDetails): Promise<AdminUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userDetails.id },
      include: { nodes: true },
    });

    //Add Redis caching to add delays between refetching Discord Data. E.G cache when last fetched
    //Or Just store in DB?
    const { data: discordUser } = await this.discordHttpService.fetchUser(
      user.accessToken
    );

    const updatedUser = await this.prismaService.user.update({
      where: { id: discordUser.id },
      data: {
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
      },
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

    return { ...updatedUser, nodes: userNodes };
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

  async getUserDetails(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { nodes: true },
    });
    user.nodes = await this.fetchExtraNodes(user.id, user.nodes);

    return user;
  }

  // createUser(details: UserDetails) {
  //   // return this.prismaService.user.create(details);
  // }
}
