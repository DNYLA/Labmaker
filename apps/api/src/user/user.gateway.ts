import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';

import {} from '@nestjs/platform-socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { Server, Socket } from 'socket.io';
import { TokenType } from '../utils/types';
import { Log, RedditConfig } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class UserGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: string[]) {
    console.log('Client Connected to WebSocket');
    const token = client.handshake.headers.authorization.split(' ')[1];
    const result = await this.authService.verify(token);
    console.log(result);
    if (!result) {
      console.log('Disconnected');
      client.disconnect();
    } else if (result.type === TokenType.Bot) {
      client.join('bot');
    } else {
      const user = await this.userService.getUserDetails(result.sub);
      user.nodes.forEach((node) => {
        console.log(`Joined Room ${node.id}`);
        client.join(node.id.toString());
      });
      console.log(client.id);
      client.data = user;
      console.log('Joined Node Rooms');
    }
  }

  // afterInit(server: Server) {
  afterInit() {
    console.log('Connected');
  }

  public notifyConfig(config: RedditConfig) {
    this.server
      .to('bot')
      .to(config.id.toString())
      .emit('config', JSON.stringify(config));
  }

  public newConfig(config: RedditConfig) {
    this.server.sockets.sockets.forEach((socket) => {
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

  public notifyLogs(log: Log) {
    this.server.to(log.nodeId.toString()).emit('log', JSON.stringify(log));
  }

  public notifyDelete(id: number) {
    this.server.to('bot').emit('deleteConfig', id);
  }

  // @UseGuards(WSGuard)
  // @SubscribeMessage('message')
  // handleConfig(
  //   // @ConnectedSocket() client: Socket,
  //   @MessageBody() message: string
  // ): void {
  //   this.server.emit('message', message);
  // }
}
