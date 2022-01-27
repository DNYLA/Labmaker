import {
  Tickets,
  CreateTicket,
  Ticket,
  PartialTicket,
  TicketAction,
} from '@labmaker/shared';
import { AXIOS } from './Axios';

export const getTicket = (serverId: string, ticketId: number) =>
  AXIOS.get<Ticket>(`/guilds/tickets/${serverId}/${ticketId}`);

export const getTickets = (serverId: string, userId: string) =>
  AXIOS.get<Tickets>(`/guilds/tickets/${serverId}/${userId}`);

export const getActiveTickets = (serverId: string) =>
  AXIOS.get<PartialTicket[]>(`/guilds/tickets/${serverId}`);

export const createTicket = (ticket: CreateTicket) =>
  AXIOS.post<Ticket>(`/guilds/tickets`, ticket);

export const updateTicket = (
  serverId: string,
  ticketId: number,
  action: TicketAction
) =>
  AXIOS.put<Ticket>(`guilds/tickets/${serverId}/${ticketId}?action=${action}`);

export const deleteTicket = (serverId: string, ticketId: number) =>
  AXIOS.delete<Ticket>(`guilds/tickets/${serverId}/${ticketId}`);
