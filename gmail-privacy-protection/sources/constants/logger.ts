import { LoggingKind, LogLevel } from '@/definitions';

export const LogLevels = {
  Info: 'info',
  Error: 'error',
  Warning: 'warning',
  Success: 'success',
} as const;

export const LoggingKinds = {
  None: 'none',
  Error: 'error',
  All: 'all',
} satisfies { [key: string]: LogLevel | 'none' | 'all' };

export const LoggingKindLabels = {
  None: 'なし',
  Error: 'エラー',
  All: 'すべて',
} as const;

export const LoggingKindVariants = [
  { value: LoggingKinds.None, label: LoggingKindLabels.None },
  { value: LoggingKinds.Error, label: LoggingKindLabels.Error },
  { value: LoggingKinds.All, label: LoggingKindLabels.All },
] satisfies { value: LoggingKind; label: string }[];
