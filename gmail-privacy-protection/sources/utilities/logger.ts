import { LogLevel } from '@/definitions';

export class Logger {
  private static readonly styles: Record<LogLevel, string> = {
    info: 'ℹ️',
    error: '❌',
    warning: '⚠️',
    success: '✅',
  };

  private static create(message: string, level: LogLevel): void {
    const boxMessage = `%c
Gmail Privacy Protection ▶ ${Logger.styles[level]} ${message}
`;

    console.info(
      boxMessage,
      `font-family: monospace;
       font-size: 12px;
       font-weight: bold;
       line-height: 1.5;
       padding: 4px;`
    );
  }

  static info(message: string): void {
    Logger.create(message, 'info');
  }

  static error(message: string): void {
    Logger.create(message, 'error');
  }

  static warning(message: string): void {
    Logger.create(message, 'warning');
  }

  static success(message: string): void {
    Logger.create(message, 'success');
  }
}
