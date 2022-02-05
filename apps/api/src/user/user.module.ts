import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
