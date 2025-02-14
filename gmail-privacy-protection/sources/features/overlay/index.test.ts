import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { ThemeToggle } from '@/components';
import {
  MessageKinds,
  ModeKinds,
  ReactivateKinds,
  ReactivateTimers,
  ReactivateInactives,
  Themes,
} from '@/constants';
import { ReactivateTimer } from '@/definitions';
import { NotFoundElement } from '@/exceptions';
import { Messenger, Storage } from '@/utilities';

import { ProtectPrivacy, SetupPassword } from './pages';

import { Overlay } from '.';

describe('Overlay', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    Overlay['_element'] = null;
    Overlay['timeout'] = null;
    vi.clearAllMocks();
    vi.spyOn(SetupPassword, 'render').mockResolvedValue();
    vi.spyOn(ProtectPrivacy, 'render').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('start', () => {
    let cast: Function;

    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(Messenger, 'listen').mockImplementation((fn) => {
        cast = fn;
      });
    });

    it('アプリケーションが起動されること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue(Storage.defaults());

      await Overlay.start();

      const element = document.querySelector('.gpp-overlay');
      expect(element).not.toBeNull();
      expect(element?.className).toContain('gpp-overlay-active');
    });

    it('ライトモードとしてアプリケーションが起動されること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        theme: Themes.Light,
      });

      await Overlay.start();

      const element = document.querySelector('.gpp-overlay');
      expect(element?.className).toContain('light-mode');
      expect(element?.className).toContain('gpp-overlay-active');
      expect(element?.className).not.toContain('dark-mode');
    });

    it('ダークモードとしてアプリケーションが起動されること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        theme: Themes.Dark,
      });

      await Overlay.start();

      const element = document.querySelector('.gpp-overlay');
      expect(element?.className).toContain('dark-mode');
      expect(element?.className).toContain('gpp-overlay-active');
      expect(element?.className).not.toContain('light-mode');
    });

    it('複数回アプリケーションが起動されないこと', async () => {
      await Overlay.start();
      await vi.mocked(SetupPassword.render).mockClear();
      await vi.mocked(ProtectPrivacy.render).mockClear();

      await Overlay.start();

      expect(SetupPassword.render).not.toHaveBeenCalled();
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
      expect(document.querySelector('.gpp-overlay')).not.toBeNull();
    });

    it('解除方法がパスワードでストレージにパスワードが設定されていない場合、パスワード設定画面を表示すること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue(Storage.defaults());
      vi.spyOn(Storage, 'getOne').mockResolvedValue({
        kind: ModeKinds.Password,
        value: null,
      });

      await Overlay.start();

      expect(SetupPassword.render).toHaveBeenCalledTimes(1);
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
    });

    it('解除方法がパスワードでストレージにパスワードが設定されている場合、プライバシー保護画面を表示すること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue(Storage.defaults());
      vi.spyOn(Storage, 'getOne').mockResolvedValue({
        kind: ModeKinds.Password,
        value: 'password123',
      });

      await Overlay.start();

      expect(ProtectPrivacy.render).toHaveBeenCalledTimes(1);
      expect(SetupPassword.render).not.toHaveBeenCalled();
    });

    it('解除方法がクリックの場合、簡易なプライバシー保護画面を表示すること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue(Storage.defaults());
      vi.spyOn(Storage, 'getOne').mockResolvedValue({
        kind: ModeKinds.Click,
        value: null,
      });

      await Overlay.start();

      expect(ProtectPrivacy.render).toHaveBeenCalledTimes(1);
      expect(SetupPassword.render).not.toHaveBeenCalled();
    });

    it('機能が有効化されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue(Storage.defaults());
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      vi.spyOn(Overlay, 'close').mockResolvedValue();
      await Overlay.start();

      await cast({
        kind: MessageKinds.State,
        value: true,
      });

      expect(Overlay.active).toHaveBeenCalledTimes(1);
      expect(Overlay.close).not.toHaveBeenCalled();
    });

    it('機能が無効化されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue(Storage.defaults());
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      vi.spyOn(Overlay, 'close').mockResolvedValue();
      await Overlay.start();

      await cast({
        kind: MessageKinds.State,
        value: false,
      });

      expect(Overlay.close).toHaveBeenCalledTimes(1);
      expect(Overlay.active).not.toHaveBeenCalled();
    });

    it('タイマーが有効になっている状態で機能が有効化された場合、指定された時間後にオーバーレイが表示されること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: false,
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      await Overlay.start();
      await Overlay.close();
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });

      await cast({
        kind: MessageKinds.State,
        value: true,
      });

      expect(Overlay.active).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(ReactivateTimers.Minutes5);
      expect(Overlay.active).toHaveBeenCalledTimes(2);
    });

    it('解除方法がクリックに変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        mode: {
          kind: ModeKinds.Password,
          value: null,
        },
      });
      await Overlay.start();
      vi.mocked(ProtectPrivacy.render).mockClear();
      vi.mocked(SetupPassword.render).mockClear();
      vi.spyOn(Storage, 'getOne').mockResolvedValue({ kind: ModeKinds.Click, value: null });

      await cast({
        kind: MessageKinds.Mode,
        value: ModeKinds.Click,
      });

      expect(ProtectPrivacy.render).toHaveBeenCalledTimes(1);
      expect(SetupPassword.render).not.toHaveBeenCalled();
    });

    it('解除方法がパスワードに変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        mode: {
          kind: ModeKinds.Click,
          value: null,
        },
      });
      await Overlay.start();
      vi.mocked(SetupPassword.render).mockClear();
      vi.mocked(ProtectPrivacy.render).mockClear();
      vi.spyOn(Storage, 'getOne').mockResolvedValue({ kind: ModeKinds.Password, value: null });

      await cast({
        kind: MessageKinds.Mode,
        value: ModeKinds.Password,
      });

      expect(SetupPassword.render).toHaveBeenCalledTimes(1);
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
    });

    it('自動再開がなしに変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'timer').mockResolvedValue(ReactivateTimers.Minutes5);
      await Overlay.start();
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        reactivate: {
          enabled: false,
          kind: ReactivateKinds.None,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });

      await cast({
        kind: MessageKinds.Reactivate,
        value: ReactivateKinds.None,
      });

      expect(Overlay.timer).not.toHaveBeenCalled();
    });

    it('自動再開が離脱時に変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        reactivate: {
          enabled: false,
          kind: ReactivateKinds.None,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'timer').mockResolvedValue(ReactivateTimers.Minutes5);
      await Overlay.start();
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
      });

      await cast({
        kind: MessageKinds.Reactivate,
        value: ReactivateKinds.Inactive,
      });

      expect(Overlay.timer).not.toHaveBeenCalled();
    });

    it('自動再開がタイマーに変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'timer').mockResolvedValue(ReactivateTimers.Minutes5);
      await Overlay.start();
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes10,
        },
      });

      await cast({
        kind: MessageKinds.Reactivate,
        value: ReactivateKinds.Timer,
      });

      expect(Overlay.timer).toHaveBeenCalledTimes(1);
    });

    it('テーマがライトモードに変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        theme: Themes.Dark,
      });
      vi.spyOn(ThemeToggle, 'rebuild').mockResolvedValue(document.createElement('div'));
      await Overlay.start();
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        theme: Themes.Light,
      });

      await cast({
        kind: MessageKinds.Theme,
        value: Themes.Light,
      });

      expect(ThemeToggle.rebuild).toHaveBeenCalledWith({ fixed: true });
      expect(Overlay.element.classList.contains('light-mode')).toBe(true);
      expect(Overlay.element.classList.contains('dark-mode')).toBe(false);
    });

    it('テーマがダークモードに変更されたことを検知できること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        theme: Themes.Light,
      });
      vi.spyOn(ThemeToggle, 'rebuild').mockResolvedValue(document.createElement('div'));
      await Overlay.start();
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        theme: Themes.Dark,
      });

      await cast({
        kind: MessageKinds.Theme,
        value: Themes.Dark,
      });

      expect(ThemeToggle.rebuild).toHaveBeenCalledWith({ fixed: true });
      expect(Overlay.element.classList.contains('dark-mode')).toBe(true);
      expect(Overlay.element.classList.contains('light-mode')).toBe(false);
    });

    it('機能が無効になっている状態でタブが切り替わった場合、オーバーレイは表示されないこと', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: false,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      await Overlay.start();

      document.dispatchEvent(new Event('visibilitychange'));

      await vi.waitFor(() => {
        expect(Overlay.active).not.toHaveBeenCalled();
      });
    });

    it('自動再開がなしになっている状態でタブが切り替わった場合、オーバーレイは表示されないこと', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: false,
          kind: ReactivateKinds.None,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      await Overlay.start();

      document.dispatchEvent(new Event('visibilitychange'));

      await vi.waitFor(() => {
        expect(Overlay.active).not.toHaveBeenCalled();
      });
    });

    it('自動再開がタイマーになっている状態でタブが切り替わった場合、オーバーレイは表示されないこと', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      await Overlay.start();

      document.dispatchEvent(new Event('visibilitychange'));

      await vi.waitFor(() => {
        expect(Overlay.active).not.toHaveBeenCalled();
      });
    });

    it('自動再開が離脱時になっている状態でタブが切り替わった場合、オーバーレイが表示されること', async () => {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      await Overlay.start();

      document.dispatchEvent(new Event('visibilitychange'));

      await vi.waitFor(() => {
        expect(Overlay.active).toHaveBeenCalled();
      });
    });
  });

  describe('timer', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('自動再開がタイマーになっている場合、指定された時間後にオーバーレイが表示されること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();

      const time = await Overlay.timer();

      expect(time).toBe(ReactivateTimers.Minutes5);
      vi.advanceTimersByTime(ReactivateTimers.Minutes5);
      expect(Overlay.active).toHaveBeenCalledTimes(1);
      expect(Overlay['timeout']).not.toBeNull();
    });

    it('機能が無効になっている状態で自動再開がタイマーの場合、指定された時間後にオーバーレイは表示されないこと', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: false,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();

      const time = await Overlay.timer();

      expect(time).toBeNull();
      expect(Overlay.active).not.toHaveBeenCalled();
      expect(Overlay['timeout']).toBeNull();
    });

    it('自動再開がタイマー以外になっている場合、指定された時間後にオーバーレイは表示されないこと', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();

      const time = await Overlay.timer();

      expect(time).toBeNull();
      expect(Overlay.active).not.toHaveBeenCalled();
      expect(Overlay['timeout']).toBeNull();
    });

    it('タイマーの値が不正な場合、指定された時間後にオーバーレイは表示されないこと', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: -1 as ReactivateTimer,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();

      const time = await Overlay.timer();

      expect(time).toBeNull();
      expect(Overlay.active).not.toHaveBeenCalled();
      expect(Overlay['timeout']).toBeNull();
    });

    it('タイマーが設定されている場合、クリアした上で再度タイマーを設定すること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'active').mockResolvedValue();
      vi.spyOn(window, 'clearTimeout').mockImplementation(() => {});
      const timeout = window.setTimeout(() => {}, ReactivateTimers.Minutes5);
      Overlay['timeout'] = timeout;

      const time = await Overlay.timer();

      expect(time).toBe(ReactivateTimers.Minutes5);
      vi.advanceTimersByTime(ReactivateTimers.Minutes5);
      expect(Overlay.active).toHaveBeenCalledTimes(1);
      expect(Overlay['timeout']).not.toBeNull();
      expect(Overlay['timeout']).not.toBe(timeout);
      expect(window.clearTimeout).toHaveBeenCalledTimes(1);
      expect(window.clearTimeout).toHaveBeenCalledWith(timeout);
    });
  });

  describe('close', () => {
    it('オーバーレイを閉じること', async () => {
      vi.spyOn(Storage, 'get').mockResolvedValue({
        ...Storage.defaults(),
        enabled: true,
        reactivate: {
          enabled: true,
          kind: ReactivateKinds.Timer,
          inactive: ReactivateInactives.Off,
          timer: ReactivateTimers.Minutes5,
        },
      });
      vi.spyOn(Overlay, 'timer').mockResolvedValue(ReactivateTimers.Minutes5);
      const element = document.createElement('div');
      Overlay['_element'] = element;

      await Overlay.close();

      expect(Overlay.timer).toHaveBeenCalledTimes(1);
      expect(element.classList).toContain('gpp-overlay-inactive');
      expect(element.classList).not.toContain('gpp-overlay-active');
    });

    it('オーバーレイが存在しない場合、エラーをスローすること', async () => {
      Overlay['_element'] = null;

      await expect(Overlay.close()).rejects.toThrow(NotFoundElement);
    });
  });

  describe('active', () => {
    it('オーバーレイを表示すること', async () => {
      Overlay['_element'] = document.createElement('div');

      await Overlay.active();

      expect(Overlay.element.classList).toContain('gpp-overlay-active');
      expect(Overlay.element.classList).not.toContain('gpp-overlay-inactive');
    });

    it('オーバーレイが存在しない場合、エラーをスローすること', async () => {
      Overlay['_element'] = null;

      await expect(Overlay.active()).rejects.toThrow(NotFoundElement);
    });
  });

  describe('replace', () => {
    it('子要素を置き換えた上でテーマボタンが表示されること', async () => {
      const element = document.createElement('div');
      Overlay['_element'] = element;
      vi.spyOn(element, 'replaceChildren').mockImplementation(() => {});
      const button = document.createElement('div');
      button.id = 'gpp-theme-container';
      vi.spyOn(ThemeToggle, 'build').mockResolvedValue(button);
      const child = document.createElement('div');

      await Overlay.replace(child);

      expect(element.replaceChildren).toHaveBeenCalledTimes(1);
      expect(element.replaceChildren).toHaveBeenCalledWith(child);
      expect(ThemeToggle.build).toHaveBeenCalledTimes(1);
      expect(ThemeToggle.build).toHaveBeenCalledWith({ fixed: true });
      expect(element.querySelector('#gpp-theme-container')).not.toBeNull();
    });
  });
});
