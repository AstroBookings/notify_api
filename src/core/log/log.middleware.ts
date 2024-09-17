import { Logger } from '@nestjs/common';
import { convertToKB } from '@shared/utils/size-converter.util';
import { NextFunction, Request, Response } from 'express';

/**
 * Function middleware to log the request and response
 * @param req - The Request being processed
 * @param res - The Response being issued
 * @param next - The NextFunction to call to continue processing
 */
export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const statusCode: number = res.statusCode;
    const contentLength: number = parseInt(res.get('content-length') || '0');
    const contentKb = convertToKB(contentLength);
    const message = `${method} ${originalUrl} ${statusCode} ${contentKb}`;
    new Logger('HTTP').verbose(message);
  });

  next();
}
