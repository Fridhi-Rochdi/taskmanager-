import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getMetrics(@Headers('x-api-key') apiKey: string) {
    const expectedApiKey = process.env.METRICS_API_KEY;
    
    if (!expectedApiKey || apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    
    return this.metricsService.getMetrics();
  }
}
