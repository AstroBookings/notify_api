import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';

const logConfig = registerAs('log', () => ({
  level: process.env.LOG_LEVEL || 'log',
}));

/**
 * Configuration module for the logging system
 * @description This module is responsible for configuring the logging system. It uses the ConfigModule to load the configuration from the environment variables.
 */
@Module({
  imports: [ConfigModule.forFeature(logConfig)],
})
export class LogModule {}
