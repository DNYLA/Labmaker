import { RedditConfigDto } from '@labmaker/wrapper';
import { AXIOS } from './Axios';

export const getRedditConfig = (id: number) =>
  AXIOS.get<RedditConfigDto>(`reddit/${id}`);

export const getRedditConfigs = () => AXIOS.get<RedditConfigDto[]>(`reddit`);

export const createRedditConfig = (newConfig: RedditConfigDto) =>
  AXIOS.post<RedditConfigDto>(`reddit`, newConfig);

export const updateRedditConfig = (updatedConfig: RedditConfigDto) =>
  AXIOS.put<RedditConfigDto>(`reddit`, updatedConfig);

export const deleteRedditConfig = (nodeId: number) =>
  AXIOS.delete(`reddit/${nodeId}`);
