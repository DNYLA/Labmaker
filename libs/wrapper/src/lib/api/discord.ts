import {
  PartialGuild,
  PartialGuildChannel,
  PartialRole,
} from '@labmaker/shared';
import { AXIOS } from './Axios';

export const getGuilds = () => AXIOS.get<PartialGuild[]>(`discord/guilds`);

export const getChannels = (serverId: string) =>
  AXIOS.get<PartialGuildChannel[]>(`discord/${serverId}/channels`);

export const getRoles = (serverId: string) =>
  AXIOS.get<PartialRole[]>(`discord/${serverId}/roles`);
