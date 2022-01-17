import { GuildConfig, GuildConfigDto, PaymentDto } from '@labmaker/wrapper';
import { AXIOS } from './Axios';

export const getDiscordConfigs = () => AXIOS.get<GuildConfigDto[]>(`/guilds/`);

export const getDiscordConfig = (id: string) =>
  AXIOS.get<GuildConfig>(`/guilds/${id}?payments=true`);

export const createDiscordConfig = (id: string, name: string) =>
  AXIOS.post<GuildConfigDto>(`/guilds/${id}/${name}`);

export const updateDiscordConfig = (config: GuildConfigDto) =>
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
