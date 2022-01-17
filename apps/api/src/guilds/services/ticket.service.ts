import { Injectable } from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from '../dtos/create-ticket.dto';
import { Ticket } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prismaService: PrismaService) {}

  /**
   * `getTicket` returns a ticket object from the database.
   * @param {string} serverId - string - The server ID of the server the ticket is in.
   * @param {number} ticketId - number - The ID of the ticket to get.
   * @returns The Ticket Object
   */
  async getTicket(serverId: string, ticketId: number): Promise<Ticket> {
    //Update Database to make ServerId + TicketID + Channel ID Unique Combination
    return await this.prismaService.ticket.findFirst({
      where: { serverId, ticketId },
    });
  }

  /**
   * `getTickets` returns all the tickets for a given server.
   * @param {string} serverId - The ID of the server to get tickets for.
   * @returns An array of tickets.
   */
  async getTickets(serverId: string): Promise<Ticket[]> {
    return await this.prismaService.ticket.findMany({ where: { serverId } });
  }

  /**
   * Create a new ticket.
   * @param {CreateTicketDto} newTicketDto - CreateTicketDto
   * @returns The newly created ticket.
   */
  async createTicket(newTicketDto: CreateTicketDto): Promise<Ticket> {
    return await this.prismaService.ticket.create({ data: newTicketDto });
  }

  /**
   * Update the ticket with the given id.
   * @param {UpdateTicketDto} updateTicketDto - UpdateTicketDto
   * @returns The updated ticket.
   */
  async updateConfig(updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    return await this.prismaService.ticket.update({
      where: { id: updateTicketDto.id },
      data: updateTicketDto,
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
