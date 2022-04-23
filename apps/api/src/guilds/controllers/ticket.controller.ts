import { PartialTicket, TicketAction, Tickets } from '@labmaker/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/Jwt.guard';
import { UserDetails } from '../../utils/types';
import { CurrentUser } from '../../utils/decorators';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { TicketService } from '../services/ticket.service';

@Controller('guilds/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // @Get('/:serverId/:ticketId')
  // getTicket(
  //   @Param('serverId') serverId: string,
  //   @Param('ticketId') ticketId: number
  // ): Promise<Ticket> | undefined {
  //   return this.ticketService.getTicket(serverId, ticketId);
  // }

  @Get('/:serverId/:userId')
  @UseGuards(JwtAuthGuard)
  getTickets(
    @Param('serverId') serverId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: UserDetails
  ): Promise<Tickets> {
    return this.ticketService.getTickets(serverId, userId, user);
  }

  @Get('/:serverId')
  @UseGuards(JwtAuthGuard)
  getServerTickets(
    @Param('serverId') serverId: string,
    @CurrentUser() user: UserDetails
  ): Promise<PartialTicket[]> {
    return this.ticketService.getServerTickets(serverId, user);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  createTicket(
    @Body() body: CreateTicketDto,
    @CurrentUser() user: UserDetails
  ): Promise<Ticket> {
    return this.ticketService.createTicket(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:serverId/:ticketId')
  handleTicket(
    @Param('serverId') serverId: string,
    @Param('ticketId') ticketId: number,
    @Query('action') action: TicketAction,
    @CurrentUser() user: UserDetails
  ): Promise<Ticket> {
    return this.ticketService.handleTicket(serverId, ticketId, action, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:serverId/:ticketId')
  deleteTicket(
    @Param('serverId') serverId: string,
    @Param('ticketId') ticketId: number,
    @CurrentUser() user: UserDetails
  ) {
    return this.ticketService.deleteTicket(serverId, ticketId, user);
  }
}
