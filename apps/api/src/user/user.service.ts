import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { UserDetails } from '../auth/userDetails.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/User.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(HttpService) private readonly httpService: HttpService,
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
      },
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

    const extraNodes = await this.prismaService.redditConfig.findMany({
      where: { nodeEditors: { has: user.id } },
    });

    //Ensures Duplicate Nodes arent sent. (This is already handled on the client side + API endpoiint for updating but its better)
    //To be safe if its only one line to check.
    const userNodes = [...new Set(user.nodes)].concat(extraNodes);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      discriminator: updatedUser.discriminator,
      avatar: updatedUser.avatar,
      nodes: userNodes,
    };
  }

  async getUserDetails(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }
}
