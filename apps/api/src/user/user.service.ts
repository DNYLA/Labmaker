import { Injectable, Logger } from '@nestjs/common';
import { UserDetails } from '../auth/userDetails.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/User.dto';
import { User } from '../utils/types';
import { DiscordHttpService } from '../discord/services/discord-http.service';

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
      include: { nodes: true },
    });

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
    });

    const userNodes = await this.fetchExtraNodes(user);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      discriminator: updatedUser.discriminator,
      avatar: updatedUser.avatar,
      nodes: userNodes,
    };
  }

  private async fetchExtraNodes(user: User) {
    const extraNodes = await this.prismaService.redditConfig.findMany({
      where: { nodeEditors: { has: user.id } },
    });

    //Ensures Duplicate Nodes arent sent. (This is already handled on the client side + API endpoiint for updating but its better)
    //To be safe if its only one line to check.
    return [...new Set(user.nodes)].concat(extraNodes);
  }

  async getUserDetails(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { nodes: true },
    });

    user.nodes = await this.fetchExtraNodes(user);

    return user;
  }

  // createUser(details: UserDetails) {
  //   // return this.prismaService.user.create(details);
  // }
}
