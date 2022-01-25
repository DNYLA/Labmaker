import { Injectable } from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from '../dtos/create-ticket.dto';
import { Role, Ticket } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../auth/userDetails.dto';
import { Tickets } from '@labmaker/shared';

@Injectable()
export class TicketService {
  constructor(private prismaService: PrismaService) {}

  /**
   * `getTicket` returns a ticket object from the database.
   * @param {string} serverId - string - The server ID of the server the ticket is in.
   * @param {number} ticketId - number - The ID of the ticket to get.
   * @returns The Ticket Object
   */
  async getTicket(serverId: string, id: number): Promise<Ticket> {
    return await this.prismaService.ticket.findFirst({
      where: { serverId, id },
    });
  }

  /**
   * `getTickets` returns all the tickets for a given server.
   * @param {string} serverId - The ID of the server to get tickets for.
   * @returns An array of tickets.
   */
  async getTickets(serverId: string, user: UserDetails): Promise<Tickets> {
    let filter = {};

    if (user.role === Role.USER) {
      filter = { serverId, creatorId: user.id };
    } else if (user.role === Role.TUTOR) {
      filter = { serverId, tutorId: user.id };
    } else {
      filter = { serverId }; //Just return all for now
    }

    // console.log(user.ro);

    const fetchedTickets = await this.prismaService.ticket.findMany({
      where: filter,
    });

    const filteredTickets: Tickets = {
      active: [],
      completed: [],
    };

    fetchedTickets.forEach((ticket) => {
      if (ticket.completed) filteredTickets.completed.push(ticket);
      else filteredTickets.active.push(ticket);
    });

    return filteredTickets;
  }

  /**
   * Create a new ticket.
   * @param {CreateTicketDto} newTicketDto - CreateTicketDto
   * @returns The newly created ticket.
   */
  async createTicket(ticket: CreateTicketDto): Promise<Ticket> {
    const due = new Date(ticket.due);
    return await this.prismaService.ticket.create({ data: ticket });
  }

  /**
   * Update the ticket with the given id.
   * @param {UpdateTicketDto} updateTicketDto - UpdateTicketDto
   * @returns The updated ticket.
   */
  async updateConfig(ticket: UpdateTicketDto): Promise<Ticket> {
    return await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: ticket,
    });
  }

  /**
   * `deleteTicket` is a function that deletes a ticket from the database.
   * @param {number} id - number
   * @returns The result of the mutation.
   */
  async deleteTicket(id: number) {
    return await this.prismaService.ticket.delete({ where: { id } });
  }
}
