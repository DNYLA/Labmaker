import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from '../dtos/create-ticket.dto';
import { Role, Ticket } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../auth/userDetails.dto';
import { PartialTicket, TicketAction, Tickets } from '@labmaker/shared';
import { UserRole } from '@labmaker/wrapper';

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
  async getTickets(
    serverId: string,
    userId: string,
    user: UserDetails
  ): Promise<Tickets> {
    console.log('test');
    if (userId !== user.id) throw new ForbiddenException();

    let filter = {};

    if (user.role === Role.USER) {
      filter = { serverId, creatorId: user.id };
    } else {
      filter = { serverId, tutorId: user.id };
    }

    const fetchedTickets = await this.prismaService.ticket.findMany({
      orderBy: [{ id: 'desc' }],
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
    console.log(filteredTickets);
    return filteredTickets;
  }

  async getServerTickets(
    serverId: string,
    user: UserDetails
  ): Promise<PartialTicket[]> {
    if (user.role === Role.USER) throw new ForbiddenException();

    const fetchedTickets = await this.prismaService.ticket.findMany({
      orderBy: [{ id: 'desc' }],
      where: { serverId, completed: false, tutor: null },
    });

    const tickets: PartialTicket[] = [];

    //Filter Information as we dont want to send back the Users Information such as
    //there DiscordID;
    fetchedTickets.forEach((ticket) => {
      tickets.push({
        id: ticket.id,
        serverId: ticket.serverId,
        type: ticket.type,
        subject: ticket.subject,
        education: ticket.education,
        budget: ticket.budget,
        additionalInfo: ticket.additionalInfo,
        due: ticket.due,
      });
    });

    return tickets;
  }

  async createTicket(
    ticket: CreateTicketDto,
    user: UserDetails
  ): Promise<Ticket> {
    // const due = new Date(ticket.due);
    if (user.role === Role.TUTOR) throw new ForbiddenException();
    return await this.prismaService.ticket.create({ data: ticket });
  }

  //Common Auth Checks in here
  async handleTicket(
    serverId: string,
    ticketId: number,
    action: TicketAction,
    user: UserDetails
  ) {
    if (user.role === Role.USER) throw new ForbiddenException();

    const ticket = await this.prismaService.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException();
    if (ticket.serverId !== serverId) throw new ForbiddenException();

    switch (action) {
      case TicketAction.Accept:
        return this.acceptTutor(ticket, user);
      case TicketAction.Resign:
        return this.resignTutor(ticket, user);
    }
  }

  private async acceptTutor(
    ticket: Ticket,
    user: UserDetails
  ): Promise<Ticket> {
    if (ticket.tutorId) throw new ConflictException('Job Already Accepted');

    return await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: { tutorId: user.id },
    });
  }

  private async resignTutor(
    ticket: Ticket,
    user: UserDetails
  ): Promise<Ticket> {
    if (ticket.tutorId !== user.id) throw new ForbiddenException();

    return await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: { tutorId: null },
    });
  }

  async deleteTicket(id: number) {
    return await this.prismaService.ticket.delete({ where: { id } });
  }
}
