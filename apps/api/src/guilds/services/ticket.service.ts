import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { Role, Ticket } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDetails } from '../../utils/types';
import {
  PartialTicket,
  TicketAction,
  TicketNotif,
  Tickets,
} from '@labmaker/shared';
import { WebsocketGateway } from '../../websockets/socket';

@Injectable()
export class TicketService {
  constructor(
    private prismaService: PrismaService,
    private wsGateway: WebsocketGateway
  ) {}

  // /**
  //  * `getTicket` returns a ticket object from the database.
  //  * @param {string} serverId - string - The server ID of the server the ticket is in.
  //  * @param {number} ticketId - number - The ID of the ticket to get.
  //  * @returns The Ticket Object
  //  */
  // async getTicket(id: number): Promise<Ticket> {
  //   return await this.prismaService.ticket.findUnique({
  //     where: { id },
  //   });
  // }

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
    if (userId !== user.id) throw new ForbiddenException();

    let filter = {};

    if (user.role === Role.USER) {
      filter = { creatorId: user.id };
    } else {
      filter = { tutorId: user.id };
    }

    const fetchedTickets = await this.prismaService.ticket.findMany({
      orderBy: [{ id: 'desc' }],
      where: { ...filter, deleted: false, serverId },
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

  async getServerTickets(
    serverId: string,
    user: UserDetails
  ): Promise<PartialTicket[]> {
    if (user.role === Role.USER) throw new ForbiddenException();

    return await this.prismaService.ticket.findMany({
      orderBy: [{ id: 'desc' }],
      where: {
        serverId,
        completed: false,
        deleted: false,
        tutor: null,
        due: { gte: new Date() }, //Dont want posts that are already "Due" (Create Cron Job Which automatically Completes them? or do this manually via Admin Dashboard)
      },
      select: {
        id: true,
        serverId: true,
        type: true,
        subject: true,
        education: true,
        budget: true,
        additionalInfo: true,
        due: true,
      },
    });
  }

  async createTicket(
    ticket: CreateTicketDto,
    user: UserDetails
  ): Promise<Ticket> {
    // const due = new Date(ticket.due);
    //Update Fetch GuildConfig to Use Service
    const config = await this.prismaService.discordConfig.findUnique({
      where: { id: ticket.serverId },
    });

    if (!config || !config.ticketSystem)
      throw new ServiceUnavailableException();

    if (user.role === Role.TUTOR) throw new ForbiddenException();
    const sTicket = await this.prismaService.ticket.create({
      data: { ...ticket, creatorId: user.id },
    });

    this.wsGateway.notifyTicket(sTicket, TicketNotif.Created);
    return sTicket;
  }

  //Common Auth Checks in here
  async handleTicket(
    serverId: string,
    ticketId: number,
    action: TicketAction,
    user: UserDetails
  ) {
    if (user.role === Role.USER && action !== TicketAction.Complete)
      throw new ForbiddenException();

    const ticket = await this.prismaService.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) throw new NotFoundException();
    if (ticket.serverId !== serverId) throw new ForbiddenException();
    if (ticket.deleted) throw new GoneException();

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

    const uTicket = await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: { tutorId: user.id },
    });
    this.wsGateway.notifyTicket(uTicket, TicketNotif.Accepted);
    return uTicket;
  }

  private async resignTutor(
    ticket: Ticket,
    user: UserDetails
  ): Promise<Ticket> {
    if (ticket.tutorId !== user.id) throw new ForbiddenException();

    const uTicket = await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: { tutorId: null },
    });

    this.wsGateway.notifyTicket(ticket, TicketNotif.Resigned); //Send old Ticket with tutorId
    return uTicket;
  }

  async deleteTicket(serverId: string, ticketId: number, user: UserDetails) {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) throw new NotFoundException();
    if (ticket.creatorId !== user.id && user.role !== Role.ADMIN)
      //Allows Admins to delete
      throw new ForbiddenException();
    if (ticket.serverId !== serverId) throw new ForbiddenException();
    if (ticket.deleted) return ticket; //Already Deleted

    //Dont want to actually delete the ticket as admins may want to view
    //data from all tickets a student has created.
    const uTicket = await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: { deleted: true },
    });
    this.wsGateway.notifyTicket(uTicket, TicketNotif.Deleted);
    return uTicket;
  }
}
