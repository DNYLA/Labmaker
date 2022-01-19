import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const URI = req.headers['referer'];
    console.log(req.headers);

    console.log(`URI Call 1 - ${URI}`);

    const activate = (await super.canActivate(context)) as boolean;
    console.log(`Activated: ${activate}`);
    console.log(`URI call 2 - ${URI}`);

    // console.log(req.headers);

    return activate;
  }
}
