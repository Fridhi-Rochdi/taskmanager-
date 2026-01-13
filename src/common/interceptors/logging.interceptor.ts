import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  private sanitizeBody(body: any): any {
    if (!body) return undefined;
    const sanitized = { ...body };
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    return sanitized;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const traceId = request.traceId || 'no-trace-id';
    const requestId = request.requestId || 'no-request-id';
    const startTime = Date.now();

    this.logger.log({
      message: 'Incoming Request',
      traceId,
      requestId,
      method,
      url,
      ip,
      userAgent,
      body: method === 'POST' || method === 'PATCH' ? this.sanitizeBody(body) : undefined,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          this.logger.log({
            message: 'Request Completed',
            traceId,
            requestId,
            method,
            url,
            ip,
            statusCode,
            responseTime: `${responseTime}ms`,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;

          this.logger.error({
            message: 'Request Failed',
            traceId,
            requestId,
            method,
            url,
            ip,
            error: error.message,
            stack: error.stack,
            responseTime: `${responseTime}ms`,
          });
        },
      }),
    );
  }
}
