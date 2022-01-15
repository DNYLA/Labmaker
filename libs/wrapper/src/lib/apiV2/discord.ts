import { PartialGuild } from '../types';
import { AXIOS } from './Axios';

export const getGuilds = () => AXIOS.get<PartialGuild[]>(`discord/guilds`);
