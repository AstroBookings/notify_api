import { AllExceptionsFilter } from '@core/all-exceptions.filter';
import { CustomLogger } from '@core/custom-logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const APP_OPTIONS = {
  logger: new CustomLogger(new ConfigService()),
};
const VALIDATION_PIPE_OPTIONS = {
  forbidNonWhitelisted: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, APP_OPTIONS);
  const PORT = app.get(ConfigService).get('APP_PORT');
  const ENV = app.get(ConfigService).get('APP_ENV');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT);
  const logger = new Logger('Notify API');
  logger.warn(`🚀  initialized on port ${PORT} in ${ENV} mode`);
  logger.warn(`Log level: ${app.get(ConfigService).get('LOG_LEVEL')}`);
}
bootstrap();
