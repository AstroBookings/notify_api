import { CanActivate, ExecutionContext, Injectable, Logger, LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Guard for JWT token authentication.
 * @description Extracts and verifies the JWT token from the request header. Adds the user to the request object.
 */
@Injectable()
export class AuthJwtGuard implements CanActivate {
  #logger: LoggerService = new Logger(AuthJwtGuard.name);

  constructor(private jwtService: JwtService) {}

  /**
   * Checks if the request can be activated by verifying the JWT token.
   * @param context - The execution context.
   * @returns A boolean indicating if the request can be activated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.#extractTokenFromHeader(request);
    if (!token) {
      this.#logger.error('👽 No token provided');
      return false;
    }
    return this.#verifyToken(token, request);
  }

  #extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') return undefined;
    return token;
  }

  async #verifyToken(token: string, request: any): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch (error) {
      this.#logger.error('👽 Invalid token', error);
      return false;
    }
  }
}
