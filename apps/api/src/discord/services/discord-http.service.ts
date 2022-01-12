import { Injectable } from '@nestjs/common';
import { DISCORD_API_URL } from '../../utils/constants';
import axios, { AxiosResponse } from 'axios';
import { DiscordUser, PartialGuild } from '../../utils/types';

@Injectable()
export class DiscordHttpService {
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>> {
    return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>> {
    return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  }

  fetchUser(accessToken: string): Promise<AxiosResponse<DiscordUser>> {
    return axios.get<DiscordUser>(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // fetchGuildChannels(): Promise<AxiosResponse<GuildChannel[]>> {}
  // fetchGuildBan(): Promise<AxiosResponse<GuildChannel[]>> {}
  // deleteGuildBan(): Promise<AxiosResponse<GuildChannel[]>> {}
}
