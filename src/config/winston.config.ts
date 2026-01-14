import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import * as fs from 'fs';

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

export const winstonConfig = WinstonModule.createLogger({
  level: logLevel,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, context, ...meta }) => {
            const metaString = Object.keys(meta).length
              ? JSON.stringify(meta)
              : '';
            return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${metaString}`;
          },
        ),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
