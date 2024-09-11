import { AllExceptionsFilter } from '@core/all-exceptions.filter';
import { CustomLogger } from '@core/custom-logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const APP_OPTIONS = {
  logger: new CustomLogger(),
};
const VALIDATION_PIPE_OPTIONS = {
  forbidNonWhitelisted: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, APP_OPTIONS);
  const PORT = app.get(ConfigService).get('APP_PORT');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT);
  new Logger('System API').verbose(`🚀  initialized on port ${PORT}`);
}
bootstrap();
