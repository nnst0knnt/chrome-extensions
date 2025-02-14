import { TitleSection } from '@/definitions';

export const TitleSections = {
  SetupPassword: {
    primary: 'パスワードを設定',
    secondary: '安全なパスワードを設定してください',
  },
  ChangePassword: {
    primary: 'パスワードを変更',
    secondary: '変更したいパスワードを入力してください',
  },
  ProtectPrivacy: {
    primary: 'プライバシーを保護',
    secondary: 'メールの内容は安全のため非表示になっています',
  },
} as const satisfies Record<string, TitleSection>;
