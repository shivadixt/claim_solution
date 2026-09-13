import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { SessionUserData } from '../auth.service.js';

export const CurrentUser = createParamDecorator(
  (data: keyof SessionUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    return data && user ? user[data] : user;
  },
);
