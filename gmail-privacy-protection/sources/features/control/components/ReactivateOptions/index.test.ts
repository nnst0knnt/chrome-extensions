import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  LogLevels,
  MessageKinds,
  ReactivateInactives,
  ReactivateKinds,
  ReactivateKindVariants,
  ReactivateTimers,
} from '@/constants';
import { Messenger, Storage } from '@/utilities';

import { TimerOptions } from './TimerOptions';

import { ReactivateOptions } from '.';

describe('ReactivateOptions', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(TimerOptions, 'build').mockResolvedValue(document.createElement('div'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('現在の自動再開に基づく選択肢を生成すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      enabled: true,
      kind: ReactivateKinds.Inactive,
      inactive: ReactivateInactives.On,
      timer: ReactivateTimers.Minutes5,
    });

    const options = await ReactivateOptions.build();
    document.documentElement.appendChild(options);

    expect(options.className).toBe('gpp-control-options');
    expect(options.querySelector('.gpp-control-options-title')?.textContent).toBe('自動再開');
    expect(options.querySelectorAll('input[type="radio"]').length).toBe(
      ReactivateKindVariants.length
    );
    expect(
      (options.querySelector(`input[value="${ReactivateKinds.Inactive}"]`) as HTMLInputElement)
        .checked
    ).toBe(true);
    expect(TimerOptions.build).toHaveBeenCalled();
  });

  it('自動再開が変更された場合、クラスの状態とストレージの更新、メッセージの送信が行われること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      enabled: true,
      kind: ReactivateKinds.None,
      inactive: ReactivateInactives.Off,
      timer: ReactivateTimers.Minutes5,
    });
    const save = vi.spyOn(Storage, 'save').mockResolvedValue();
    const cast = vi.spyOn(Messenger, 'cast').mockResolvedValue();
    const options = await ReactivateOptions.build();
    document.documentElement.appendChild(options);
    const none = document.getElementById(ReactivateKinds.None) as HTMLDivElement;
    const inactive = document.getElementById(ReactivateKinds.Inactive) as HTMLDivElement;
    const timer = document.getElementById(ReactivateKinds.Timer) as HTMLDivElement;

    const radio = options.querySelector(
      `input[value="${ReactivateKinds.Inactive}"]`
    ) as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(none.classList.contains('other')).toBe(true);
      expect(inactive.classList.contains('other')).toBe(false);
      expect(timer.classList.contains('other')).toBe(true);
      expect(save).toHaveBeenCalledWith({
        reactivate: {
          kind: ReactivateKinds.Inactive,
          inactive: ReactivateInactives.On,
        },
      });
      expect(cast).toHaveBeenCalledWith({
        kind: MessageKinds.Reactivate,
        value: ReactivateKinds.Inactive,
        logger: {
          level: LogLevels.Info,
          value: expect.any(String),
        },
      });
    });
  });
});
