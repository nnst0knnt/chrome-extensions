import { ReactivateInactives, ReactivateKinds, ReactivateTimers } from '@/constants';

export type ReactivateKind = (typeof ReactivateKinds)[keyof typeof ReactivateKinds];

export type ReactivateInactive = (typeof ReactivateInactives)[keyof typeof ReactivateInactives];

export type ReactivateTimer = (typeof ReactivateTimers)[keyof typeof ReactivateTimers];
