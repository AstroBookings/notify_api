import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { convertToKB } from '@shared/utils/size-converter.util';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);

  /**
   * Logs the request and response details for each request.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const statusCode: number = res.statusCode;
      const contentLength: number = parseInt(res.get('content-length') || '0');
      const message = `${method} ${originalUrl} ${statusCode} ${convertToKB(contentLength)}`;
      this.logger.verbose(message);
    });

    next();
  }
}
