import {
  CreateOrderDto,
  GuildConfig,
  GuildConfigDto,
  PaymentDto,
} from '../types';
import { AXIOS } from './Axios';

export const getGuildConfigs = () => AXIOS.get<GuildConfigDto[]>(`/guilds/`);

export const getGuildDetails = (id: string) =>
  AXIOS.get<GuildConfig>(`/guilds/${id}?payments=true`);

export const getGuildConfig = (id: string) =>
  AXIOS.get<GuildConfigDto>(`/guilds/${id}?payments=false`);

export const createGuildConfig = (id: string, name: string) =>
  AXIOS.post<GuildConfigDto>(`/guilds/${id}/${name}`);

export const updateGuildConfig = (config: GuildConfigDto) =>
  AXIOS.put<GuildConfigDto>(`guilds`, config);

//Payment Stuff Below
export const getDiscordPayments = (id: string) =>
  AXIOS.get(`guilds/payments/${id}`);

export const createDiscordPayments = (payments: PaymentDto[]) =>
  AXIOS.post(`guilds/payments`, payments);

export const updatePayments = (payments: PaymentDto[]) => {
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
