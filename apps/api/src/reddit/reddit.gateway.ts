import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';

import {} from '@nestjs/platform-socket.io';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { WSGuard } from '../auth/guards/WSAuth.guard';
import { Log, RedditConfig } from '.prisma/client';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { TokenType } from '../utils/types';

@WebSocketGateway({ namespace: 'reddit' })
export class RedditGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: string[]) {
    console.log(args);
    const token = client.handshake.headers.authorization.split(' ')[0];

    const result = await this.authService.verify(token);
    if (!result) {
      client.disconnect();
    } else if (result.type === TokenType.Bot) {
      client.join('bot');
    } else {
      const user = await this.userService.getUserDetails(result.id);
      // user.nodes.forEach((node) => client.join(node.id.toString()));
    }
  }

  afterInit(server: Server) {
    console.log(server);
    console.log('Connected');
  }

  public notifyConfig(config: RedditConfig) {
    this.server
      .to('bot')
      .to(config.id.toString())
      .emit('config', JSON.stringify(config));
  }

  public notifyLogs(log: Log) {
    this.server.to(log.nodeId.toString()).emit('log', JSON.stringify(log));
  }

  public notifyDelete(id: number) {
    this.server.to('bot').emit('deleteConfig', id);
  }

  @UseGuards(WSGuard)
  @SubscribeMessage('config')
  handleConfig(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string
  ): void {
    console.log(client);
    console.log('Sent');
    this.server.emit('message', message);
  }
}
