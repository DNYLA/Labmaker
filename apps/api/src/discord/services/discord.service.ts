import { PartialGuildChannel, PartialRole } from '@labmaker/shared';
import { Injectable } from '@nestjs/common';
import { UserDetails } from '../../auth/userDetails.dto';
import { DiscordHttpService } from './discord-http.service';

@Injectable()
export class DiscordService {
  constructor(private readonly discordHttpService: DiscordHttpService) {}

  getBotGuilds() {
    return this.discordHttpService.fetchBotGuilds();
  }

  getUserGuilds(accessToken: string) {
    return this.discordHttpService.fetchUserGuilds(accessToken);
  }

  async fetchGuildChannels(guildId: string): Promise<PartialGuildChannel[]> {
    return (await this.discordHttpService.fetchGuildChannels(guildId)).data;
  }

  async fetchGuildRoles(guildId: string): Promise<PartialRole[]> {
    return (await this.discordHttpService.fetchGuildRoles(guildId)).data;
  }

  async fetchGuilds(user: UserDetails) /*: Promise<Guild[]> */ {
    const { data: userGuilds } = await this.getUserGuilds(user.accessToken);
    const { data: botGuilds } = await this.getBotGuilds();
    const adminGuilds = userGuilds.filter(
      ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
    );

    const validGuilds = userGuilds.filter((guild) =>
      botGuilds.some((botGuild) => botGuild.id === guild.id)
    );

    return validGuilds;
  }
}
