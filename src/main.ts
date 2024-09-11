import { AllExceptionsFilter } from '@core/all-exceptions.filter';
import { CustomLogger } from '@core/custom-logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const APP_OPTIONS = {
  logger: new CustomLogger(),
};
const VALIDATION_PIPE_OPTIONS = {
  forbidNonWhitelisted: true,
};
const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, APP_OPTIONS);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT);
  new Logger('System API').verbose(`🚀  initialized on port ${PORT}`);
}
bootstrap();
