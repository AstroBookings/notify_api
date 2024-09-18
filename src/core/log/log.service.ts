import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as chalk from 'chalk';

/**
 * Custom Logger Service
 * @description It uses chalk to colorize the log messages.
 */
@Injectable()
export class LogService implements LoggerService {
  private readonly logLevel: LogLevel = this.configService.get<LogLevel>('LOG_LEVEL');
  private readonly logLevels: LogLevel[] = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'];

  constructor(private configService: ConfigService) {}

  #getTimestamp(): string {
    return new Date().toTimeString().split(' ')[0];
  }

  #getContextColor(level: LogLevel): chalk.Chalk {
    const colors: Record<LogLevel, chalk.Chalk> = {
      fatal: chalk.red,
      error: chalk.red,
      warn: chalk.yellow,
      log: chalk.green,
      debug: chalk.magenta,
      verbose: chalk.cyan,
    };
    return colors[level] || chalk.reset;
  }

  #getMessageColor(level: LogLevel): chalk.Chalk {
    return ['debug', 'verbose'].includes(level) ? chalk.dim : chalk.reset;
  }

  #formatMessage(message: any, context?: string, level: LogLevel = 'log'): string {
    const timestamp = chalk.dim.italic(`${this.#getTimestamp()}`);
    const contextColor = this.#getContextColor(level);
    const contextChunk = context ? contextColor(`[${context}] `) : '';
    const messageColor = this.#getMessageColor(level);
    const messageChunk = messageColor(message);
    return `${timestamp} ${contextChunk}${messageChunk}`;
  }

  #shouldLog(level: LogLevel): boolean {
    return this.logLevels.indexOf(level) <= this.logLevels.indexOf(this.logLevel);
  }

  log(message: any, context?: string): void {
    if (!this.#shouldLog('log')) return;
    const verboseContexts: string[] = ['RouterExplorer', 'InstanceLoader', 'RoutesResolver'];
    if (verboseContexts.includes(context)) {
      this.verbose(message, context);
      return;
    }
    console.log(this.#formatMessage(message, context, 'log'));
  }

  error(message: any, trace?: string, context?: string): void {
    if (!this.#shouldLog('error')) return;
    console.error(this.#formatMessage(message, context, 'error'));
    if (trace) {
      this.debug(`trace: ${trace}`, context);
    }
  }

  warn(message: any, context?: string): void {
    if (!this.#shouldLog('warn')) return;
    console.warn(this.#formatMessage(message, context, 'warn'));
  }

  debug(message: any, context?: string): void {
    if (!this.#shouldLog('debug')) return;
    console.debug(this.#formatMessage(message, context, 'debug'));
  }

  verbose(message: any, context?: string): void {
    if (!this.#shouldLog('verbose')) return;
    console.log(this.#formatMessage(message, context, 'verbose'));
  }
}
