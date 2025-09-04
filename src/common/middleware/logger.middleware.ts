import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'unknown';

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - Agent: ${userAgent} - IP: ${ip}`,
    );

    req['startTime'] = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - req['startTime'];

      const { statusCode } = res;

      if (statusCode >= 500) {
        this.logger.error(
          `[RESPONSE] -> ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - IP: ${ip}`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `[RESPONSE] -> ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - IP: ${ip}`,
        );
      } else {
        this.logger.log(
          `[RESPONSE] -> ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - IP: ${ip}`,
        );
      }
    });

    next();
  }
}
