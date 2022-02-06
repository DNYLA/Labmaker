import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDetails } from './types';
import * as requestIp from 'request-ip';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserDetails => {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const ipAddress = requestIp.getClientIp(request);
    const userAgent = request.headers['user-agent'];
    const referer = request.headers['referer'];
    const route = request.route;
    const path = request.originalUrl;
    const method = request.method;

    return { ...request.user, ipAddress, userAgent, referer, path, method };
  }
);
