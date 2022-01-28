import { JwtService } from '@nestjs/jwt';
import { UserPayload, UserDetails } from './userDetails.dto';
import { Response, Request } from 'express';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async verify(token: string) {
    if (!token) return false;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      return payload;
    } catch (err) {
      // console.error('Attempted to verify invalid token:', token, err.message);
      // throw new WsException('Invalid Token');
      return false;
    }
  }

  async validateUser(details: UserDetails) {
    const userData = {
      id: details.id,
      username: details.username,
      discriminator: details.discriminator,
      avatar: details.avatar,
      accessToken: details.accessToken,
      refreshToken: details.refreshToken,
      tokenVersion: details.tokenVersion,
    };

    const user = await this.prismaService.user.upsert({
      where: { id: userData.id },
      update: userData,
      create: userData,
    });

    return { token: this.createRefreshToken(user, user.role), role: user.role };
  }

  async createBotToken() {
    const botToken = this.createBotAccessToken();
    this.logger.error(botToken); //Logged As We Dont want to expose this to the public
    //In the future it will be re-writing to check for Auth and make the Token less powerful than it is (CUrrently can do anything)
    return;
  }

  async refreshToken(res: Response, req: Request) {
    const token = req.cookies.jid;
    this.logger.log(`Refresh Token - Auth Service`);

    if (!token) {
      this.logger.warn(`Empty Token`);
      return res.send({ ok: false, accessToken: '' });
    }

    let payload = null;

    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      this.logger.error(err);
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    user.tokenVersion = user.tokenVersion + 1;

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: user,
    });

    res.cookie('jid', this.createRefreshToken(updatedUser, user.role), {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/auth/refresh_token',
    });

    return res.send({
      ok: true,
      accessToken: this.createAccessToken(updatedUser, user.role),
    });
  }

  createRefreshToken(user: User, type: Role) {
    return this.jwtService.sign(
      {
        id: user.id,
        type: type,
        tokenVersion: user.tokenVersion,
      },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    );
  }

  createAccessToken(user: User, type: Role) {
    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      type: type,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
  }

  private createBotAccessToken() {
    return this.jwtService.sign(
      {
        id: '0',
        type: Role.BOT,
      },
      { secret: process.env.JWT_SECRET, expiresIn: '1y' }
    );
  }
}
