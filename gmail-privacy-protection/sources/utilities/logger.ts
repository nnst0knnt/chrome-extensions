import { LoggingKinds } from '@/constants';
import { LogLevel } from '@/definitions';

import { Storage } from './storage';

export class Logger {
  private static readonly styles: Record<LogLevel, string> = {
    info: 'ℹ️',
    error: '❌',
    warning: '⚠️',
    success: '✅',
  };

  private static async create(message: string, level: LogLevel) {
    const logging = await Storage.getOne('logging');

    let enabled = false;
    switch (true) {
      case logging === LoggingKinds.None:
        enabled = false;
        break;
      case logging === LoggingKinds.All || level === logging:
        enabled = true;
        break;
      default:
        enabled = false;
        break;
    }

    if (!enabled) return;

    console.info(
      `%c
Gmail Privacy Protection ▶ ${Logger.styles[level]} ${message}
`,
      `font-family: monospace;
       font-size: 12px;
       font-weight: bold;
       line-height: 1.5;
       padding: 4px;`
    );
  }

  static async info(message: string) {
    await Logger.create(message, 'info');
  }

  static async error(message: string) {
    await Logger.create(message, 'error');
  }

  static async warning(message: string) {
    await Logger.create(message, 'warning');
  }

  static async success(message: string) {
    await Logger.create(message, 'success');
  }
}
