import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'anonymous';
    const ip = req.ip;
    return `login-${email}-${ip}`;
  }

  //   set limit 5 attempts per minute
  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  protected getTTL(): Promise<number> {
    return Promise.resolve(60000);
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many login attempts. Please try again later after 1 minute.',
    );
  }
}
