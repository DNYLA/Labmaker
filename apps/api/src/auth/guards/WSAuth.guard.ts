import { CanActivate, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class WSGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: any): Promise<boolean | any> {
    const token = context.args[0].handshake.headers.authorization.split(' ')[1];
    if (!token) return false;
    const result = await this.authService.verify(token);

    if (!result)
      throw new WsException({ code: 401, message: 'Invalid Credentials' });

    return true;
  }
}
