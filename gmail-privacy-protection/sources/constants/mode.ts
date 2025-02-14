import { ModeKind } from '@/definitions';

export const ModeKinds = {
  Click: 'click',
  Password: 'password',
} as const;

export const ModeKindLabels = {
  Click: 'クリック',
  Password: 'パスワード',
} as const;

export const ModeKindVariants = [
  { value: ModeKinds.Click, label: ModeKindLabels.Click },
  { value: ModeKinds.Password, label: ModeKindLabels.Password },
] satisfies { value: ModeKind; label: string }[];
