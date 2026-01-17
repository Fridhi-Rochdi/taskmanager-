import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const validationErrors =
      typeof exceptionResponse === 'object' && exceptionResponse.message
        ? Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message]
        : ['Validation failed'];

    const errorResponse = {
      statusCode: status,
      error: 'Validation Error',
      message: 'Request validation failed',
      validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(status).json(errorResponse);
  }
}
