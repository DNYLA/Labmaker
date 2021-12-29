import { Logger, Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { RedditModule } from './reddit/reddit.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PayModule } from './pay/pay.module';
import { PrismaModule } from './prisma/prisma.module';

let envFilePath = '.env.development';

if (process.env.ENVIRONMENT === 'PRODUCTION') {
  envFilePath = '.env';
}
Logger.log(`Running in ${process.env.ENVIRONMENT}`);

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ envFilePath }),
    DiscordModule,
    RedditModule,
    AuthModule,
    UserModule,
    PayModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
  // exports: [PrismaService]
})
export class AppModule {}
