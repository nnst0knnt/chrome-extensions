import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import {
  LoggingKinds,
  ModeKinds,
  ReactivateInactives,
  ReactivateKinds,
  ReactivateTimers,
  Themes,
} from '@/constants';

import { Storage } from './storage';

describe('Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getOne', () => {
    it('特定のキーの値を取得できること', async () => {
      vi.spyOn(chrome.storage.sync, 'get').mockImplementation(async () => ({ enabled: false }));

      expect(await Storage.getOne('enabled')).toBe(false);
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true })
      );
    });

    it('エラー発生時にデフォルト値を返すこと', async () => {
      vi.spyOn(chrome.storage.sync, 'get').mockImplementation(async () => {
        throw new Error();
      });

      expect(await Storage.getOne('enabled')).toBe(true);
    });
  });

  describe('get', () => {
    it('複数のキーの値を取得できること', async () => {
      vi.spyOn(chrome.storage.sync, 'get').mockImplementation(async () => ({
        enabled: true,
        theme: Themes.Dark,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
      }));

      expect(await Storage.get('enabled', 'theme', 'mode')).toEqual({
        enabled: true,
        theme: Themes.Dark,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
      });
    });

    it('キー指定なしですべての値を取得できること', async () => {
      vi.spyOn(chrome.storage.sync, 'get').mockImplementation(async () => ({
        enabled: true,
        theme: Themes.Dark,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
        reactivate: {
          kind: ReactivateKinds.Timer,
          timer: ReactivateTimers.Minutes5,
        },
      }));

      expect(await Storage.get()).toEqual({
        enabled: true,
        theme: Themes.Dark,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
        reactivate: {
          kind: ReactivateKinds.Timer,
          timer: ReactivateTimers.Minutes5,
        },
      });
    });

    it('エラー発生時にデフォルト値を返すこと', async () => {
      vi.spyOn(chrome.storage.sync, 'get').mockImplementation(async () => {
        throw new Error();
      });

      expect(await Storage.get()).toEqual({
        theme: Themes.Light,
        enabled: true,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
        logging: LoggingKinds.None,
      });
    });
  });

  describe('save', () => {
    it('値を保存できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        enabled: true,
        theme: Themes.Light,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
        logging: LoggingKinds.None,
      });
      vi.spyOn(chrome.storage.sync, 'set').mockResolvedValue();

      await Storage.save({ theme: Themes.Dark });

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: Themes.Dark,
        })
      );
    });

    it('ネストされたオブジェクトを適切にマージして保存できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        enabled: true,
        theme: Themes.Light,
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
        logging: LoggingKinds.None,
      });
      vi.spyOn(chrome.storage.sync, 'set').mockResolvedValue();

      await Storage.save({
        mode: {
          kind: ModeKinds.Password,
          value: 'password123',
        },
      });

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: {
            kind: ModeKinds.Password,
            value: 'password123',
          },
        })
      );
    });

    it('エラー発生時にコンソールにエラーを出力すること', async () => {
      vi.spyOn(Storage, 'get').mockRejectedValue(new Error('failed to get'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      await Storage.save({ theme: Themes.Dark });

      expect(console.error).toHaveBeenCalledWith(new Error('failed to get'));
    });
  });
});
