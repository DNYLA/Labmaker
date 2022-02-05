import { Logger, Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { RedditModule } from './reddit/reddit.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketModule } from './websockets/websocket.module';
import { GuildsModule } from './guilds/guilds.module';
import { LogsModule } from './logs/logs.module';

Logger.log(`Running in ${process.env.ENVIRONMENT ?? 'Development'}`);

@Module({
  imports: [
    PrismaModule,
    DiscordModule,
    RedditModule,
    AuthModule,
    UserModule,
    // PayModule,
    PrismaModule,
    WebsocketModule,
    GuildsModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
