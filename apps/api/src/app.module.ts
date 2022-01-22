import { Logger, Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { RedditModule } from './reddit/reddit.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PayModule } from './pay/pay.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketModule } from './websockets/websocket.module';
import { GuildsModule } from './guilds/guilds.module';

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
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
