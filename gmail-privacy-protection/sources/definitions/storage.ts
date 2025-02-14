import { LoggingKind } from './logger';
import { ModeKind } from './mode';
import { ReactivateInactive, ReactivateKind, ReactivateTimer } from './reactivate';

import type { Theme } from './theme';

export type StorageValues = {
  theme: Theme;
  enabled: boolean;
  mode: {
    kind: ModeKind;
    value: string | null;
  };
  reactivate: {
    enabled: boolean;
    kind: ReactivateKind;
    inactive: ReactivateInactive;
    timer: ReactivateTimer;
  };
  logging: LoggingKind;
};

export type StorageKey = keyof StorageValues;
