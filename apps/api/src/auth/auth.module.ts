import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DiscordStrategy } from './strategy/discord.strategy';
import { JwtBotStrategy, JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [DiscordStrategy, AuthService, JwtStrategy, JwtBotStrategy],
})
export class AuthModule {}
