import { ReactivateKind, ReactivateTimer } from '@/definitions';

export const ReactivateKinds = {
  None: 'none',
  Inactive: 'inactive',
  Timer: 'timer',
} as const;

export const ReactivateKindLabels = {
  None: 'なし',
  Inactive: '離脱時',
  Timer: 'タイマー',
} as const;

export const ReactivateKindVariants = [
  { value: ReactivateKinds.None, label: ReactivateKindLabels.None },
  { value: ReactivateKinds.Inactive, label: ReactivateKindLabels.Inactive },
  { value: ReactivateKinds.Timer, label: ReactivateKindLabels.Timer },
] satisfies { value: ReactivateKind; label: string }[];

export const ReactivateInactives = {
  On: 'on',
  Off: 'off',
} as const;

export const ReactivateTimers = {
  Minutes5: 300000,
  Minutes10: 600000,
  Minutes20: 1200000,
  Minutes30: 1800000,
} as const;

export const ReactivateTimerLabels = {
  Minutes5: '5分',
  Minutes10: '10分',
  Minutes20: '20分',
  Minutes30: '30分',
} as const;

export const ReactivateTimerVariants = [
  { value: ReactivateTimers.Minutes5, label: ReactivateTimerLabels.Minutes5 },
  { value: ReactivateTimers.Minutes10, label: ReactivateTimerLabels.Minutes10 },
  { value: ReactivateTimers.Minutes20, label: ReactivateTimerLabels.Minutes20 },
  { value: ReactivateTimers.Minutes30, label: ReactivateTimerLabels.Minutes30 },
] satisfies { value: ReactivateTimer; label: string }[];
