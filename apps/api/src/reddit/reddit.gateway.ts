import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'ws';

import {} from '@nestjs/platform-socket.io';
import { IncomingMessage } from 'http';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/Jwt.guard';
import { WSGuard } from '../auth/guards/WSAuth.guard';
import { RedditConfig } from '.prisma/client';
import RedditGatewayMessage from './dtos/RedditGatewayMessage.dto';

@WebSocketGateway({ namespace: 'reddit' })
export class RedditGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: any, ...args: any[]) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    const result = await this.authService.verify(token);
    !result && client.disconnect();
  }

  afterInit(server: any) {
    console.log('Connected');
  }

  public notifyConfig(config: RedditConfig) {
    // this.server.clients.forEach((client) => {
    //   client.send(JSON.stringify(config));
    // });
    console.log('Emitting Config');
    this.server.emit('config', JSON.stringify(config));
  }

  public notifyDelete(id: number) {
    console.log('Emitting Delete');
    this.server.emit('deleteConfig', id);
  }

  @UseGuards(WSGuard)
  @SubscribeMessage('config')
  handleConfig(@MessageBody() message: string): void {
    console.log('Sent');
    this.server.emit('message', message);
  }
}
