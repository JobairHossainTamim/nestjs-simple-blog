import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  // context.-> request, response object

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;

    const userAgent = request.get('user-agent') || 'unknown';

    const userId = request?.user?.id || 'unauthenticated';

    this.logger.log(
      `[${method} ${url} - User: ${userId} - Agent: ${userAgent} ]`,
    );

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.log(
            `[${method} ${url} -${duration}ms- Response Size :${JSON.stringify(data)?.length || 0} bytes ]`,
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.log(
            `[${method} ${url} -${duration}ms] - Error ${error.message}`,
          );
        },
      }),
    );
  }
}
