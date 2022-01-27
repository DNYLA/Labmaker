import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserDetails, UserPayload } from '../../auth/userDetails.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
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
    if (payload.type === Role.BOT) return payload; //Bots dont have accounts in DB

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });

    if (!user)
      throw new ForbiddenException(`You don't permission to access this data`);

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
    if (payload.role !== Role.BOT)
      throw new ForbiddenException(`You don't permission to access this data`);

    return payload;
  }
}
