import { Injectable } from '@nestjs/common';

interface RequestMetrics {
  totalRequests: number;
  requestsByMethod: Record<string, number>;
  errorsByStatus: Record<string, number>;
  responseTimes: number[];
}

@Injectable()
export class MetricsService {
  private metrics: RequestMetrics = {
    totalRequests: 0,
    requestsByMethod: {},
    errorsByStatus: {},
    responseTimes: [],
  };
  private startTime: number = Date.now();

  incrementRequest(method: string): void {
    this.metrics.totalRequests++;
    this.metrics.requestsByMethod[method] =
      (this.metrics.requestsByMethod[method] || 0) + 1;
  }

  recordResponseTime(time: number): void {
    this.metrics.responseTimes.push(time);
    // Keep only last 1000 response times to avoid memory issues
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes.shift();
    }
  }

  recordError(statusCode: number): void {
    const status = statusCode.toString();
    this.metrics.errorsByStatus[status] =
      (this.metrics.errorsByStatus[status] || 0) + 1;
  }

  getMetrics() {
    const avgResponseTime =
      this.metrics.responseTimes.length > 0
        ? (
            this.metrics.responseTimes.reduce((a, b) => a + b, 0) /
            this.metrics.responseTimes.length
          ).toFixed(2)
        : 0;

    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

    return {
      uptime: uptimeFormatted,
      uptimeSeconds,
      totalRequests: this.metrics.totalRequests,
      requestsByMethod: this.metrics.requestsByMethod,
      errorsByStatus: this.metrics.errorsByStatus,
      averageResponseTime: `${avgResponseTime}ms`,
      timestamp: new Date().toISOString(),
    };
  }

  reset(): void {
    this.metrics = {
      totalRequests: 0,
      requestsByMethod: {},
      errorsByStatus: {},
      responseTimes: [],
    };
    this.startTime = Date.now();
  }
}
