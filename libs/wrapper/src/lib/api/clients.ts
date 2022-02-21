import { Client, CreateClient } from '@labmaker/shared';
import { AXIOS } from './Axios';

export const getClients = () => AXIOS.get<Client[]>(`user/clients`);

export const createClient = (client: CreateClient) =>
  AXIOS.post<Client>(`user/client`, client);

export const updateClient = (client: Client) =>
  AXIOS.put<Client>(`user/client`, client);
