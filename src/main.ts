import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
  
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  winstonConfig.log(`Application is running on: http://localhost:${port}`);
  winstonConfig.log('Database connection established successfully');
}
bootstrap();
