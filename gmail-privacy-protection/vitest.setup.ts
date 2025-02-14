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
      query: vi.fn(),
      sendMessage: vi.fn(),
    },
    runtime: {
      getURL: vi.fn((path) => `chrome-extension://mock-extension-id/${path}`),
      sendMessage: vi.fn(),
      onMessage: {
        addListener: vi.fn(),
      },
    },
  },
});

beforeEach(() => {
  vi.spyOn(console, 'info').mockImplementation(() => {});
});
