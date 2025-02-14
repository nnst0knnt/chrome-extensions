import { ModeKinds } from '@/constants';

export type ModeKind = (typeof ModeKinds)[keyof typeof ModeKinds];
