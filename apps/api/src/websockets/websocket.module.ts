import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { WebsocketHandler } from './socket';

@Module({
  imports: [AuthModule, UserModule],
  providers: [WebsocketHandler],
  // exports: [WebsocketHandler],
})
export class WebsocketModule {}
