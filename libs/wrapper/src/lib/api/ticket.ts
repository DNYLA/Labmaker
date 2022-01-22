import { CreateTicket, Ticket } from '../types';
import { TicketDto } from '../types';
import { AXIOS } from './Axios';

export const getTicket = (serverId: string, ticketId: number) =>
  AXIOS.get<TicketDto>(`/guilds/tickets/${serverId}/${ticketId}`);

export const getTickets = (serverId: string) =>
  AXIOS.get<TicketDto[]>(`/guilds/tickets/${serverId}`);

export const getUserTickets = (serverId: string) =>
  AXIOS.get<TicketDto[]>(`/guilds/tickets/${serverId}`);

export const createTicket = (ticket: CreateTicket) =>
  AXIOS.post<Ticket>(`/guilds/tickets`, ticket);

export const deleteTicket = (ticketId: number) =>
  AXIOS.delete<TicketDto>(`guilds/tickets/${ticketId}`);
