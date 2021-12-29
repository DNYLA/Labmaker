import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto } from '../dtos/create-ticket.dto';
import { TicketService } from '../services/ticket.service';

@Controller('discord/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('/:serverId/:ticketId')
  getTicket(
    @Param('serverId') serverId: string,
    @Param('ticketId') ticketId: number,
  ): Promise<Ticket> | any {
    return this.ticketService.getTicket(serverId, ticketId);
  }

  @Get('/:serverId')
  getTickets(@Param('serverId') serverId: string): Promise<Ticket[]> {
    return this.ticketService.getTickets(serverId);
  }

  @Post()
  createTicket(@Body() body: CreateTicketDto): Promise<Ticket> {
    return this.ticketService.createTicket(body);
  }

  @Put()
  updateTicket(@Body() body: UpdateTicketDto): Promise<Ticket> {
    return this.ticketService.updateConfig(body);
  }

  @Delete('/:id')
  deleteTicket(@Param('id') id: number) {
    return this.ticketService.deleteTicket(id);
  }
}
