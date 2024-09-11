import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export type LoggerConfig = {
  level: LogLevel;
};

export const LOGGER_CONFIG = registerAs(
  'logger',
  (): LoggerConfig => ({
    level: (process.env.LOG_LEVEL as LogLevel) || 'log',
  }),
);
