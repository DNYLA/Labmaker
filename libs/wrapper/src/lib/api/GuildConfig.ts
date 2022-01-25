import { GuildConfig, GuildData, Payment } from '@labmaker/shared';
import { CreateOrderDto } from '../types';
import { AXIOS } from './Axios';

export const getGuildConfigs = () => AXIOS.get<GuildConfig[]>(`/guilds/`);

//Merge with function below
export const getGuildDetails = (id: string) =>
  AXIOS.get<GuildData>(`/guilds/${id}?payments=true`);

export const getGuildConfig = (id: string) =>
  AXIOS.get<GuildConfig>(`/guilds/${id}?payments=false`);

export const createGuildConfig = (id: string, name: string) =>
  AXIOS.post<GuildConfig>(`/guilds/${id}/${name}`);

export const updateGuildConfig = (config: GuildConfig) =>
  AXIOS.put<GuildConfig>(`guilds`, config);

//Payment Stuff Below
export const getDiscordPayments = (id: string) =>
  AXIOS.get(`guilds/payments/${id}`);

export const createDiscordPayments = (payments: Payment[]) =>
  AXIOS.post(`guilds/payments`, payments);

export const updatePayments = (payments: Payment[]) => {
  console.log(payments);
  return AXIOS.put(`guilds/payments`, { payments });
};
export const deletePayments = (paymentIds: number[]) =>
  AXIOS.delete(`guilds/payments`, { data: paymentIds });

export const createPaypalOrder = (
  tutorId: string,
  channelId: string,
  price: number
) =>
  AXIOS.get<CreateOrderDto>(
    `pay/create_order/${tutorId}/${channelId}/${price}`
  );
