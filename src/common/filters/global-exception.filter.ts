import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      const dbError = exception as any;
      const isProduction = process.env.NODE_ENV === 'production';

      if (dbError.code === '23505') {
        error = 'Duplicate Entry';
        if (!isProduction && dbError.detail) {
          const fieldMatch = dbError.detail.match(/Key \((\w+)\)/);
          const field = fieldMatch ? fieldMatch[1] : 'value';
          message = `${field} already exists`;
        } else {
          message = 'A record with this value already exists';
        }
      } else if (dbError.code === '23503') {
        error = 'Foreign Key Violation';
        message = isProduction
          ? 'Referenced record does not exist'
          : dbError.detail || 'Referenced record does not exist';
      } else if (dbError.code === '23502') {
        error = 'Missing Required Field';
        if (!isProduction && dbError.column) {
          message = `Field '${dbError.column}' is required`;
        } else {
          message = 'A required field is missing';
        }
      } else {
        error = 'Database Error';
        message = 'A database error occurred';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const errorResponse = {
      statusCode: status,
      error,
      message,
      traceId: request.traceId || 'no-trace-id',
      requestId: request.requestId || 'no-request-id',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }

    this.logger.error({
      message: 'Exception caught',
      traceId: request.traceId || 'no-trace-id',
      requestId: request.requestId || 'no-request-id',
      statusCode: status,
      error,
      path: request.url,
      method: request.method,
      exception: exception instanceof Error ? exception.message : exception,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }
}
