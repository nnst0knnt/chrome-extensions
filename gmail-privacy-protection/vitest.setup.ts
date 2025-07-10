import { afterEach, beforeEach, vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  enumerable: true,
  value: () => ({
    matches: false,
  }),
});

Object.defineProperty(global, 'chrome', {
  writable: true,
  value: {
    storage: {
      sync: {
        get: vi.fn(),
        set: vi.fn(),
      },
    },
    tabs: {
      query: vi.fn().mockResolvedValue([]),
      sendMessage: vi.fn().mockResolvedValue(void 0),
    },
    runtime: {
      getURL: vi.fn((path) => `chrome-extension://mock-extension-id/${path}`),
      sendMessage: vi.fn().mockResolvedValue(void 0),
      onMessage: {
        addListener: vi.fn(),
      },
    },
  },
});

beforeEach(() => {
  vi.spyOn(console, 'info').mockImplementation(() => {});
});
