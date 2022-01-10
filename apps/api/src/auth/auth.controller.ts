import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DiscordAuthGuard } from './guards/DiscordAuth.guard';
import { AuthService } from './auth.service';

interface IUserAuthRequest extends Request {
  user: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private logger = new Logger(AuthController.name);
  @Get('login')
  @UseGuards(DiscordAuthGuard)
  login() {
    this.logger.log('Attempting to Login User'); //EsLint requires functions to not be empty even though we dont need anything in here.
  }

  @Get('redirect')
  @UseGuards(DiscordAuthGuard)
  redirect(@Res() res: Response, @Req() req: IUserAuthRequest) {
    console.log(req.user);
    res.cookie('jid', req.user, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/auth/refresh_token',
    });
    res.redirect(process.env.FRONT_END_URL);
  }

  @Post('refresh_token')
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
