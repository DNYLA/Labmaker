import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DiscordAuthGuard } from './guards/DiscordAuth.guard';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';

type UserTokenType = {
  token: string;
  role: Role;
};
interface IUserAuthRequest extends Request {
  user: UserTokenType;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private logger = new Logger(AuthController.name);
  @Get('login')
  @UseGuards(DiscordAuthGuard)
  login(@Req() req: Request) {
    this.logger.log('Attempting to Login User'); //EsLint requires functions to not be empty even though we dont need anything in here.
  }

  @Get('redirect')
  @UseGuards(DiscordAuthGuard)
  redirect(@Res() res: Response, @Req() req: IUserAuthRequest) {
    // console.log(
    //   `User: ${req.user} || Token: ${req.user.token} || Role: ${req.user.role}`
    // );

    res.cookie('jid', req.user.token, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/auth/refresh_token',
    });
    // console.log(process.env.ADMIN_DASH_URL);

    //This means the Admin can never access the User Dashboard unless both dashboards are hosted on the same
    //Ip with different subdomains/ports.
    if (req.user.role !== Role.ADMIN) res.redirect(process.env.USER_DASH_URL);
    else res.redirect(process.env.ADMIN_DASH_URL);
  }

  @Get('refresh_token')
  refreshToken(@Res() res: Response, @Req() req: Request) {
    return this.authService.refreshToken(res, req);
  }

  @Get('bot_token')
  botToken() {
    return this.authService.createBotToken();
  }

  // @Post('local/signin')
  // signinLocal(@Body() dto: AuthDto) {
  //   return this.authService.signinLocal(dto);
  // }

  // @Post('local/signup')
  // signupLocal(@Body() dto: AuthDto) {
  //   return this.authService.signupLocal(dto);
  // }
}
