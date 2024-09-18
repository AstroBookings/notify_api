import { HttpStatus, INestApplication, Logger, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LogFilter } from './core/log/log.filter';
import { logMiddleware } from './core/log/log.middleware';
import { LogService } from './core/log/log.service';

const APP_OPTIONS = {
  logger: new LogService(new ConfigService()),
};
const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  forbidNonWhitelisted: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  transform: true,
};

function getConfig(app: INestApplication<any>, entry: string) {
  return app.get(ConfigService).get(entry);
}
export const documentationBuilder = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('🚀 AstroBookings 👔 Notify API')
    .setDescription('The API to save and send notifications to users.')
    //.setVersion('1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, APP_OPTIONS);
  const PORT = getConfig(app, 'APP_PORT');
  const ENV = getConfig(app, 'APP_ENV');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.useGlobalFilters(new LogFilter());
  app.use(logMiddleware);
  documentationBuilder(app);
  await app.listen(PORT);
  const logger = new Logger('Notify API');
  logger.warn(`🚀  initialized on port ${PORT} in ${ENV} mode`);
  logger.warn(`Log level: ${getConfig(app, 'LOG_LEVEL')}`);
}
bootstrap();
