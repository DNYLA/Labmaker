import { Injectable } from '@nestjs/common';
import { DISCORD_API_URL } from '../../utils/constants';
import axios, { AxiosResponse } from 'axios';
import { DiscordUser } from '../../utils/types';
import {
  PartialGuild,
  PartialGuildChannel,
  PartialRole,
} from '@labmaker/shared';

@Injectable()
export class DiscordHttpService {
  /**
 * `fetchUserGuilds` is a function that takes an access token and returns a promise that resolves to
an array of guilds that the user is a member of.
 * @param {string} accessToken - string - The access token for the user.
 * @returns A list of guilds the user is a member of.
 */
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>> {
    return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Fetch guild info by its id.
   * @param id Guild id.
   * @param userId Used to get guild info.
   */
  fetchGuildById(id: string): Promise<AxiosResponse<PartialGuild>> {
    return axios.get<PartialGuild>(`${DISCORD_API_URL}/guilds/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  }

  /**
   * `fetchBotGuilds` is a function that fetches the guilds that the bot is a member of.
   * @returns A list of guilds that the bot is in.
   */
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>> {
    return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  }

  /**
  * `fetchUser` is a function that takes an access token and returns a promise that resolves to a
 Discord user.
  * @param {string} accessToken - string - The access token to use for the request.
  * @returns A promise that resolves to the user object.
  */
  fetchUser(accessToken: string): Promise<AxiosResponse<DiscordUser>> {
    return axios.get<DiscordUser>(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  fetchGuildChannels(
    id: string
  ): Promise<AxiosResponse<PartialGuildChannel[]>> {
    return axios.get<PartialGuildChannel[]>(
      `${DISCORD_API_URL}/guilds/${id}/channels`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
  }

  fetchGuildRoles(id: string): Promise<AxiosResponse<PartialRole[]>> {
    return axios.get<PartialRole[]>(`${DISCORD_API_URL}/guilds/${id}/roles`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  }
  // fetchGuildBan(): Promise<AxiosResponse<GuildChannel[]>> {}
  // deleteGuildBan(): Promise<AxiosResponse<GuildChannel[]>> {}
}
