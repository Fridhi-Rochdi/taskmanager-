import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TracingInterceptor } from '../src/common/interceptors/tracing.interceptor';
import { of } from 'rxjs';

describe('TracingInterceptor', () => {
  let interceptor: TracingInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracingInterceptor],
    }).compile();

    interceptor = module.get<TracingInterceptor>(TracingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should generate traceId and requestId if not present', (done) => {
    const mockRequest = { headers: {} };
    const mockResponse = { setHeader: jest.fn() };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of('test'),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe(() => {
      expect(mockRequest).toHaveProperty('traceId');
      expect(mockRequest).toHaveProperty('requestId');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-trace-id',
        expect.any(String),
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-request-id',
        expect.any(String),
      );
      done();
    });
  });

  it('should use existing traceId from header', (done) => {
    const existingTraceId = 'existing-trace-id';
    const mockRequest = { headers: { 'x-trace-id': existingTraceId } };
    const mockResponse = { setHeader: jest.fn() };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of('test'),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe(() => {
      expect(mockRequest['traceId']).toBe(existingTraceId);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-trace-id',
        existingTraceId,
      );
      done();
    });
  });
});
