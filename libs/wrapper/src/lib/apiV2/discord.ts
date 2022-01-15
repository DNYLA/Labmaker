import { PartialGuild } from '../types';
import { AXIOS } from './Axios';

export const getGuilds = () => {
  return AXIOS.get<PartialGuild[]>(`discord/guilds`);
};
