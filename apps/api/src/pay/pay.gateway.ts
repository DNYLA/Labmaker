import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { WSGuard } from '../auth/guards/WSAuth.guard';
import PayGatewayMessage from './dtos/PayGatewayMessage.dto';

@WebSocketGateway({ namespace: 'payments' })
export class PayGateway implements OnGatewayInit, OnGatewayConnection {
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

  public notifyAll(msg: PayGatewayMessage) {
    this.server.emit('pay', JSON.stringify(msg));
  }

  // Not used for anything currently.
  //
  // @UseGuards(WSGuard)
  // @SubscribeMessage('pay')
  // handleMessage(@ConnectedSocket() client: any, payload: any): string {
  //   return 'Hello sir';
  // }
}
