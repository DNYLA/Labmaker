import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigController } from './controllers/config.controller';
import { LogsService } from './services/logs.service';
import { LogsController } from './controllers/logs.controller';
import { HttpModule } from '@nestjs/axios';
import { RedditGateway } from './reddit.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [ConfigService, LogsService, RedditGateway],
  controllers: [ConfigController, LogsController],
})
export class RedditModule {}
