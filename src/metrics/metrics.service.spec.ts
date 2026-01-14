import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  describe('incrementRequest', () => {
    it('should increment total requests', () => {
      service.incrementRequest('GET');
      const metrics = service.getMetrics();

      expect(metrics.totalRequests).toBe(1);
    });

    it('should track requests by method', () => {
      service.incrementRequest('GET');
      service.incrementRequest('GET');
      service.incrementRequest('POST');

      const metrics = service.getMetrics();

      expect(metrics.requestsByMethod.GET).toBe(2);
      expect(metrics.requestsByMethod.POST).toBe(1);
    });
  });

  describe('recordResponseTime', () => {
    it('should record response times', () => {
      service.recordResponseTime(100);
      service.recordResponseTime(200);

      const metrics = service.getMetrics();

      expect(metrics.averageResponseTime).toBe('150.00ms');
    });

    it('should limit response times to last 1000 entries', () => {
      for (let i = 0; i < 1100; i++) {
        service.recordResponseTime(100);
      }

      const metrics = service.getMetrics();
      expect(metrics.averageResponseTime).toBe('100.00ms');
    });
  });

  describe('recordError', () => {
    it('should track errors by status code', () => {
      service.recordError(404);
      service.recordError(404);
      service.recordError(500);

      const metrics = service.getMetrics();

      expect(metrics.errorsByStatus['404']).toBe(2);
      expect(metrics.errorsByStatus['500']).toBe(1);
    });
  });

  describe('getMetrics', () => {
    it('should return formatted metrics with uptime', () => {
      service.incrementRequest('GET');
      service.recordResponseTime(100);

      const metrics = service.getMetrics();

      expect(metrics).toHaveProperty('totalRequests');
      expect(metrics).toHaveProperty('requestsByMethod');
      expect(metrics).toHaveProperty('errorsByStatus');
      expect(metrics).toHaveProperty('averageResponseTime');
      expect(metrics).toHaveProperty('uptime');
      expect(typeof metrics.uptime).toBe('string');
    });
  });
});
