import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';

import {} from '@nestjs/platform-socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Server, Socket } from 'socket.io';
import { TokenType } from '../utils/types';
import { Log, RedditConfig } from '@prisma/client';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @WebSocketServer() ws: Server;

  async handleConnection(client: Socket, ...args: string[]) {
    console.log('Client Connected to WebSocket');
    const token = client.handshake.headers.authorization.split(' ')[1];
    const result = await this.authService.verify(token);
    // console.log(result);

    if (!result) {
      console.log('Disconnected');
      return client.disconnect();
    } else if (result.type === TokenType.Bot) {
      return client.join('bot');
    }

    const user = await this.userService.getUserDetails(result.id);
    user.nodes.forEach((node) => {
      console.log(`Joined Room ${node.id}`);
      client.join(node.id.toString());
    });
    // console.log(client.id);
    client.data = user;
    // console.log('Joined Node Rooms');
  }

  // afterInit(server: Server) {
  afterInit() {
    console.log('Connected');
  }

  //Websocket Functions Below
  notifyConfig(config: RedditConfig) {
    console.log('Emitting Update Config');
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

  deleteConfig(id: string) {
    this.ws.to('bot').to(id).emit('deleteConfig', id);
  }

  notifyLog(log: Log) {
    this.ws.to(log.nodeId.toString()).emit('newLog', JSON.stringify(log));
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
