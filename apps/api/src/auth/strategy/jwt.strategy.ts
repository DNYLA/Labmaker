import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { TokenType } from '../../utils/types';
import { UserDetails, UserPayload } from '../../auth/userDetails.dto';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserPayload) {
    if (payload.type === TokenType.Bot) return payload; //Bots dont have accounts in DB

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });

    if (!user)
      throw new UnauthorizedException(
        `You aren't authorized to access this data`
      );

    return user;
  }
}

@Injectable()
export class JwtBotStrategy extends PassportStrategy(Strategy, 'jwtbot') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserDetails) {
    if (payload.type !== TokenType.Bot)
      throw new UnauthorizedException(
        `You aren't authorized to access this data`
      );

    return payload;
  }
}
