import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method } = request;
    const startTime = Date.now();

    this.metricsService.incrementRequest(method);

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          this.metricsService.recordResponseTime(responseTime);
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.metricsService.recordResponseTime(responseTime);
          const statusCode = error.status || 500;
          this.metricsService.recordError(statusCode);
        },
      }),
    );
  }
}
