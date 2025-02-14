import { LoggingKinds, LogLevels } from '@/constants';

export type LogLevel = (typeof LogLevels)[keyof typeof LogLevels];

export type LoggingKind = (typeof LoggingKinds)[keyof typeof LoggingKinds];
