export const MessageUrls = {
  Gmail: 'https://mail.google.com/*',
} as const;

export const MessageKinds = {
  State: 'STATE_CHANGED',
  Mode: 'MODE_CHANGED',
  Reactivate: 'REACTIVATE_CHANGED',
  Theme: 'THEME_CHANGED',
  Logging: 'LOGGING_CHANGED',
} as const;
