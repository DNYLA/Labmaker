import { TicketDto } from '../types';
import { AXIOS } from './Axios';

export const getTicket = (serverId: string, ticketId: number) =>
  AXIOS.get<TicketDto>(`/guilds/tickets/${serverId}/${ticketId}`);

export const getTickets = (serverId: string) =>
  AXIOS.get<TicketDto[]>(`/guilds/tickets/${serverId}`);

export const createTicket = (
  serverId: string,
  ticketId: number,
  channelId: string
) =>
  AXIOS.post<TicketDto>(`/guilds/tickets`, { serverId, ticketId, channelId });

export const updateTicket = (ticket: TicketDto) =>
  AXIOS.put<TicketDto>(`guilds/tickets`, ticket);

export const deleteTicket = (ticketId: number) =>
  AXIOS.delete<TicketDto>(`guilds/tickets/${ticketId}`);
