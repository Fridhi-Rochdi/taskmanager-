import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export const TRACE_ID_HEADER = 'x-trace-id';
export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const traceId = request.headers[TRACE_ID_HEADER] || uuidv4();
    const requestId = uuidv4();
    request.traceId = traceId;
    request.requestId = requestId;
    response.setHeader(TRACE_ID_HEADER, traceId);
    response.setHeader(REQUEST_ID_HEADER, requestId);
    return next.handle();
  }
}
