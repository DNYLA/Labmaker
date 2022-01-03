import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { TokenType } from '../../utils/types';
import { UserDetails } from 'apps/api/src/auth/userDetails.dto';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserDetails) {
    return payload;
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
    if (payload.type !== TokenType.Bot) {
      throw new UnauthorizedException(
        'You arent authorized to access this data'
      );
    }
    return payload;
  }
}
