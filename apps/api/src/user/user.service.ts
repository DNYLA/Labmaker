import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedditConfig, User } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { UserDetails } from '../auth/userDetails.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/User.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(HttpService) private readonly httpService: HttpService
  ) {}
  private logger = new Logger(UserService.name);

  async getUser(userDetails: UserDetails): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userDetails.id },
      include: { nodes: true },
    });

    const fetchedUser = this.httpService.get(
      `https://discord.com/api/v9/users/@me`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    const discordUser = await (await lastValueFrom(fetchedUser)).data;

    const updatedUser = await this.prismaService.user.update({
      where: { id: discordUser.id },
      data: {
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        accessToken: discordUser.accessToken,
        refreshToken: discordUser.refreshToken,
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

  private async fetchExtraNodes(user: User & { nodes: RedditConfig[] }) {
    const extraNodes = await this.prismaService.redditConfig.findMany({
      where: { nodeEditors: { has: user.id } },
    });

    //Ensures Duplicate Nodes arent sent. (This is already handled on the client side + API endpoiint for updating but its better)
    //To be safe if its only one line to check.
    return [...new Set(user.nodes)].concat(extraNodes);
  }

  async getUserDetails(id: string): Promise<User & { nodes: RedditConfig[] }> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { nodes: true },
    });

    user.nodes = await this.fetchExtraNodes(user);

    return user;
  }
}
