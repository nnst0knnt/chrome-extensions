import { MessageKinds } from '@/constants';

import { LoggingKind, LogLevel } from './logger';
import { ModeKind } from './mode';
import { ReactivateInactive, ReactivateKind, ReactivateTimer } from './reactivate';
import { Theme } from './theme';

export type StateMessage = {
  kind: typeof MessageKinds.State;
  value: boolean;
};

export type ModeMessage = {
  kind: typeof MessageKinds.Mode;
  value: ModeKind;
};

export type ReactivateMessage = {
  kind: typeof MessageKinds.Reactivate;
  value: ReactivateKind | ReactivateInactive | ReactivateTimer;
};

export type ThemeMessage = {
  kind: typeof MessageKinds.Theme;
  value: Theme;
};

export type LoggingMessage = {
  kind: typeof MessageKinds.Logging;
  value: LoggingKind;
};

export type Message = (
  | StateMessage
  | ModeMessage
  | ReactivateMessage
  | ThemeMessage
  | LoggingMessage
) & {
  logger?: {
    level: LogLevel;
    value: string;
  };
};
