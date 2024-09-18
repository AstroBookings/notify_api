import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

type HttpContext = {
  request: Request;
  response: Response;
};

type source = {
  method: string;
  originalUrl: string;
};

/**
 * Filter that catches and logs all exceptions thrown in the application.
 * @description It also sends a formatted response to the client.
 */
@Catch(HttpException)
export class LogFilter<T extends HttpException> implements ExceptionFilter {
  #logger: Logger = new Logger(LogFilter.name);

  /**
   * Catches the exception and processes it.
   * @param exception - The exception to catch.
   * @param host - The host to catch the exception.
   */
  catch(exception: T, host: ArgumentsHost): void {
    const ctx: HttpContext = this.#getHttpContext(host);
    const status: number = this.#getStatus(exception);
    this.#logError(exception, ctx.request);
    this.#sendResponse(ctx.response, status, exception);
  }

  #getHttpContext(host: ArgumentsHost): HttpContext {
    const ctx = host.switchToHttp();
    return {
      request: ctx.getRequest<Request>(),
      response: ctx.getResponse<Response>(),
    };
  }

  #getStatus(exception: T): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  #logError(exception: T, request: Request): void {
    const { method, originalUrl }: source = request;
    const error: string = exception.message;
    const trace: string = exception.stack || '';
    this.#logger.error(`${method}:- ${originalUrl} ${error}`, trace, LogFilter.name);
    const nodeEnv: string | undefined = process.env.NODE_ENV;
    if (nodeEnv !== 'production') {
      this.#logger.debug(JSON.stringify(exception), LogFilter.name);
    }
  }

  #sendResponse(response: Response, status: number, exception: T): void {
    const body = {
      statusCode: status,
      message: exception['response']?.message || exception.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(body);
  }
}
