import { LogLevels } from '@/constants';

export type LogLevel = (typeof LogLevels)[keyof typeof LogLevels];
