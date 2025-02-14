export const Rules = {
  PasswordInvalid: {
    isFailed: (input: string, correct: string) => input !== correct,
    message: 'パスワードが正しくありません',
  },
  PasswordTooShort: {
    isFailed: (input: string) => input.length < 4,
    message: 'パスワードは4文字以上で設定してください',
  },
} as const;
