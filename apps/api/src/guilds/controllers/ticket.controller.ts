import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/Jwt.guard';
import { UserDetails } from '../../auth/userDetails.dto';
import { CurrentUser } from '../../utils/decorators';
import { CreateTicketDto, UpdateTicketDto } from '../dtos/create-ticket.dto';
import { TicketService } from '../services/ticket.service';

@Controller('guilds/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('/:serverId/:ticketId')
  getTicket(
    @Param('serverId') serverId: string,
    @Param('ticketId') ticketId: number
  ): Promise<Ticket> | undefined {
    return this.ticketService.getTicket(serverId, ticketId);
  }

  @Get('/:serverId')
  @UseGuards(JwtAuthGuard)
  getTickets(
    @Param('serverId') serverId: string,
    @CurrentUser() user: UserDetails
  ): Promise<Ticket[]> {
    return this.ticketService.getTickets(serverId, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createTicket(
    @Body() body: CreateTicketDto,
    @CurrentUser() user: UserDetails
  ): Promise<Ticket> {
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
