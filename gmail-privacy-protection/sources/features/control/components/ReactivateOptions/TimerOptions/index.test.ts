import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  LogLevels,
  MessageKinds,
  ReactivateInactives,
  ReactivateKinds,
  ReactivateTimers,
  ReactivateTimerVariants,
} from '@/constants';
import { Messenger, Storage } from '@/utilities';

import { TimerOptions } from '.';

describe('TimerOptions', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('タイマーが有効化された場合、選択肢が表示されること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      enabled: true,
      kind: ReactivateKinds.Timer,
      inactive: ReactivateInactives.Off,
      timer: ReactivateTimers.Minutes5,
    });

    const options = await TimerOptions.build();

    expect(options.className).toBe('gpp-control-options ');
    expect(options.querySelectorAll('input[type="radio"]').length).toBe(
      ReactivateTimerVariants.length
    );
    expect(options.querySelectorAll('.gpp-control-option.secondary').length).toBe(
      ReactivateTimerVariants.length
    );
    expect(
      (options.querySelector(`input[value="${ReactivateTimers.Minutes5}"]`) as HTMLInputElement)
        .checked
    ).toBe(true);
  });

  it('タイマーが無効化された場合、選択肢が非活性化すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      enabled: true,
      kind: ReactivateKinds.None,
      inactive: ReactivateInactives.Off,
      timer: ReactivateTimers.Minutes5,
    });

    const options = await TimerOptions.build();

    expect(options.className).toBe('gpp-control-options disabled');
  });

  it('タイマーの値が変更された場合、クラスの状態とストレージの更新、メッセージの送信が行われること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      enabled: true,
      kind: ReactivateKinds.Timer,
      inactive: ReactivateInactives.Off,
      timer: ReactivateTimers.Minutes5,
    });
    const save = vi.spyOn(Storage, 'save').mockResolvedValue();
    const cast = vi.spyOn(Messenger, 'cast').mockResolvedValue();
    const options = await TimerOptions.build();
    document.documentElement.appendChild(options);
    const minutes5 = document.getElementById(
      ReactivateTimers.Minutes5.toString()
    ) as HTMLDivElement;
    const minutes10 = document.getElementById(
      ReactivateTimers.Minutes10.toString()
    ) as HTMLDivElement;
    const minutes20 = document.getElementById(
      ReactivateTimers.Minutes20.toString()
    ) as HTMLDivElement;
    const minutes30 = document.getElementById(
      ReactivateTimers.Minutes30.toString()
    ) as HTMLDivElement;

    const input = options.querySelector(
      `input[value="${ReactivateTimers.Minutes10}"]`
    ) as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(minutes5.classList.contains('other')).toBe(true);
      expect(minutes10.classList.contains('other')).toBe(false);
      expect(minutes20.classList.contains('other')).toBe(true);
      expect(minutes30.classList.contains('other')).toBe(true);
      expect(save).toHaveBeenCalledWith({
        reactivate: { timer: ReactivateTimers.Minutes10 },
      });
      expect(cast).toHaveBeenCalledWith({
        kind: MessageKinds.Reactivate,
        value: ReactivateTimers.Minutes10,
        logger: {
          level: LogLevels.Info,
          value: expect.any(String),
        },
      });
    });
  });
});
