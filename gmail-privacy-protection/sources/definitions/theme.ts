import { Themes } from '@/constants';

export type Theme = (typeof Themes)[keyof typeof Themes];
