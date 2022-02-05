import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigController } from './controllers/config.controller';
import { LogsService } from './services/logs.service';
import { LogsController } from './controllers/logs.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { WebsocketModule } from '../websockets/websocket.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [HttpModule, UserModule, WebsocketModule, LogsModule],
  providers: [ConfigService, LogsService],
  controllers: [ConfigController, LogsController],
})
export class RedditModule {}
