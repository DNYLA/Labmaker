import {
  PartialGuild,
  PartialGuildChannel,
  PartialRole,
} from '@labmaker/shared';
import { AXIOS } from './Axios';

export const getGuilds = () => AXIOS.get<PartialGuild[]>(`discord/guilds`);

export const getChannels = (id: string) =>
  AXIOS.get<PartialGuildChannel[]>(`discord/${id}/channels`);

export const getRoles = (id: string) =>
  AXIOS.get<PartialRole[]>(`discord/${id}/roles`);
