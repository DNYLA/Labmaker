import { Profile, Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDetails } from '../../auth/userDetails.dto';
import { Role } from '@prisma/client';
@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, discriminator, id: discordId, avatar } = profile;
    const details: UserDetails = {
      id: discordId,
      username,
      discriminator,
      avatar,
      accessToken,
      refreshToken,
      role: Role.USER,
    };

    return await this.authService.validateUser(details);
  }
}
