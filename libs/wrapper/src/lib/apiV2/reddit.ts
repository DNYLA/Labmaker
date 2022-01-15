import { RedditConfigDto } from '@labmaker/wrapper';
import { PartialGuild } from '../types';
import { AXIOS } from './Axios';

export const getRedditConfig = (id: number) => {
  return AXIOS.get<RedditConfigDto>(`reddit/${id}`);
};

export const getRedditConfigs = () => {
  return AXIOS.get<RedditConfigDto[]>(`reddit`);
};

export const createRedditConfig = (newConfig: RedditConfigDto) => {
  return AXIOS.post<RedditConfigDto>(`reddit`, newConfig);
};

export const updateRedditConfig = (updatedConfig: RedditConfigDto) => {
  return AXIOS.put<RedditConfigDto>(`reddit`, updatedConfig);
};

export const deleteRedditConfig = (nodeId: number) => {
  return AXIOS.delete(`reddit/${nodeId}`);
};
