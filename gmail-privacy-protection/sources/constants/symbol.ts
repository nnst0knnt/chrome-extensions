export const EnabledSymbolPaths = {
  16: chrome.runtime.getURL('assets/enabled-symbols/16.png'),
  32: chrome.runtime.getURL('assets/enabled-symbols/32.png'),
  48: chrome.runtime.getURL('assets/enabled-symbols/48.png'),
  128: chrome.runtime.getURL('assets/enabled-symbols/128.png'),
} as const;

export const DisabledSymbolPaths = {
  16: chrome.runtime.getURL('assets/disabled-symbols/16.png'),
  32: chrome.runtime.getURL('assets/disabled-symbols/32.png'),
  48: chrome.runtime.getURL('assets/disabled-symbols/48.png'),
  128: chrome.runtime.getURL('assets/disabled-symbols/128.png'),
} as const;
