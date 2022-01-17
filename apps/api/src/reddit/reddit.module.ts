import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigController } from './controllers/config.controller';
import { LogsService } from './services/logs.service';
import { LogsController } from './controllers/logs.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { WebsocketModule } from '../websockets/websocket.module';

@Module({
  imports: [HttpModule, AuthModule, UserModule, WebsocketModule],
  providers: [ConfigService, LogsService],
  controllers: [ConfigController, LogsController],
})
export class RedditModule {}
