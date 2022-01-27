import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import PayGatewayMessage from './dtos/PayGatewayMessage.dto';

@WebSocketGateway({ namespace: 'payments' })
export class PayGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private authService: AuthService) {}
  afterInit() {
    console.log('connected');
  }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: string[]) {
    console.log(args);
    const token = client.handshake.headers.authorization.split(' ')[1];
    const result = await this.authService.verify(token);
    console.log(token);
    !result && client.disconnect();
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
