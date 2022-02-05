import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import {} from '@nestjs/platform-socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Server, Socket } from 'socket.io';
import { DiscordConfig, Log, RedditConfig, Role, Ticket } from '@prisma/client';
import { TicketChannelInfo, TicketInfo, TicketNotif } from '@labmaker/shared';
import { UseGuards } from '@nestjs/common';
import { WSGuard } from '../auth/guards/WSAuth.guard';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private prismaService: PrismaService
  ) {}

  @WebSocketServer() ws: Server;

  async handleConnection(client: Socket, ...args: string[]) {
    console.log(args);
    console.log('Client Connected to WebSocket');
    const token = client.handshake.headers.authorization.split(' ')[1];
    const result = await this.authService.verify(token);

    if (!result) {
      console.log('Disconnected');
      return client.disconnect();
    } else if (result.type === Role.BOT) {
      return client.join('bot');
    }

    const user = await this.userService.getAdminUserDetails(result.id);
    user.nodes.forEach((node) => {
      console.log(`Joined Room ${node.id}`);
      client.join(node.id.toString());
    });
    client.data = user;
  }

  afterInit() {
    console.log('Connected');
  }

  //Websocket Functions Below
  notifyConfig(config: RedditConfig) {
    this.ws
      .to('bot')
      .to(config.id.toString())
      .emit('config', JSON.stringify(config));
  }

  newConfig(config: RedditConfig) {
    this.ws.sockets.sockets.forEach((socket) => {
      if (config.userId === socket.data.id) {
        socket.join(config.id.toString());
      } else {
        config.nodeEditors.forEach((id) => {
          if (socket.data.id === id) {
            socket.join(config.id.toString());
          }
        });
      }
    });

    this.notifyConfig(config);
  }

  notifyGuildConfig(config: DiscordConfig) {
    this.ws.to('bot').emit('guildConfig', JSON.stringify(config));
  }

  notifyTicket(ticket: Ticket, type: TicketNotif) {
    const info: TicketInfo = { ticket, type };
    this.ws.to('bot').emit('ticket', JSON.stringify(info));
  }

  deleteConfig(id: string) {
    this.ws.to('bot').to(id).emit('deleteConfig', id);
  }

  notifyLog(log: Log) {
    this.ws.to(log.nodeId.toString()).emit('newLog', JSON.stringify(log));
  }

  @UseGuards(WSGuard)
  @SubscribeMessage('ticketChannelId')
  async handleConfig(
    // @ConnectedSocket() client: Socket,
    @MessageBody() ticket: TicketChannelInfo
  ) {
    // console.log(tJson);
    // this.server.emit('message', message);
    // const ticket: TicketChannelInfo = JSON.parse(tJson);
    console.log(ticket);
    await this.prismaService.ticket.update({
      where: { id: ticket.id },
      data: { channelId: ticket.channelId },
    });
  }
}
