import { Injectable } from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from '../dtos/create-ticket.dto';
import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prismaService: PrismaService) {}

  async getTicket(serverId: string, ticketId: number): Promise<Ticket> {
    //Update Database to make ServerId + TicketID + Channel ID Unique Combination
    return await this.prismaService.ticket.findFirst({
      where: { serverId, ticketId },
    });
  }

  async getTickets(serverId: string): Promise<Ticket[]> {
    return await this.prismaService.ticket.findMany({ where: { serverId } });
  }

  async createTicket(newTicketDto: CreateTicketDto): Promise<Ticket> {
    return await this.prismaService.ticket.create({ data: newTicketDto });
  }

  async updateConfig(updateTicketDto: UpdateTicketDto): Promise<any> {
    return await this.prismaService.ticket.update({
      where: { id: updateTicketDto.id },
      data: updateTicketDto,
    });
  }

  async deleteTicket(id: number) {
    return await this.prismaService.ticket.delete({ where: { id } });
  }
}
