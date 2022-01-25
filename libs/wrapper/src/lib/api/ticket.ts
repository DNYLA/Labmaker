import { Tickets, CreateTicket, Ticket } from '@labmaker/shared';
import { AXIOS } from './Axios';

export const getTicket = (serverId: string, ticketId: number) =>
  AXIOS.get<Ticket>(`/guilds/tickets/${serverId}/${ticketId}`);

export const getTickets = (serverId: string) =>
  AXIOS.get<Tickets>(`/guilds/tickets/${serverId}`);

export const createTicket = (ticket: CreateTicket) =>
  AXIOS.post<Ticket>(`/guilds/tickets`, ticket);

export const deleteTicket = (ticketId: number) =>
  AXIOS.delete<Ticket>(`guilds/tickets/${ticketId}`);
