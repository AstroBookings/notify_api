import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  readonly #logger = new Logger(ApiKeyGuard.name);
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('X-API-Key');

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const validApiKey = this.configService.get<string>('API_KEY');

    if (!validApiKey) {
      throw new Error('API_KEY is not configured in the environment');
    }

    if (apiKey !== validApiKey) {
      this.#logger.debug('👽 Invalid API Key', apiKey, validApiKey);
      throw new UnauthorizedException('Invalid API Key');
    }

    this.#logger.debug('🎉 API Key is valid');

    return true;
  }
}
