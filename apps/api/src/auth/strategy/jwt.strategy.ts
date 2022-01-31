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
    if (payload.type === Role.BOT)
      return { id: payload.id, role: payload.type }; //Bots dont have accounts in DB

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

  async validate(payload: UserPayload) {
    //Example Bot Payload
    //{ id: '0', type: 'BOT', iat: 1643374465, exp: 1674932065 }

    if (payload.type !== Role.BOT)
      throw new ForbiddenException(`You don't permission to access this data`);

    //In the Future Bots will have their own ID, Username etc.
    //For now we send back id + role
    return {
      id: payload.id,
      // username: 'Labmaker-Bot',
      // discriminator: '#0000',
      // accessToken: '0',
      // refreshToken: '0',
      role: payload.type,
    };
  }
}
