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
export class WebsocketHandler implements OnGatewayInit, OnGatewayConnection {
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

  // @UseGuards(WSGuard)
  // @SubscribeMessage('message')
  // handleConfig(
  //   // @ConnectedSocket() client: Socket,
  //   @MessageBody() message: string
  // ): void {
  //   this.server.emit('message', message);
  // }
}
