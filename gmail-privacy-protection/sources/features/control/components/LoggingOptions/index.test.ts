import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { LogLevels, LoggingKindVariants, LoggingKinds, MessageKinds } from '@/constants';
import { Messenger, Storage } from '@/utilities';

import { LoggingOptions } from '.';

describe('LoggingOptions', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('現在のロギングに基づき、選択肢を生成すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.None);

    const container = await LoggingOptions.build();

    expect(container).toBeInstanceOf(HTMLDivElement);
    expect(container.className).toBe('gpp-control-options');
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(
      LoggingKindVariants.length
    );
    expect(
      (container.querySelector(`input[value="${LoggingKinds.None}"]`) as HTMLInputElement).checked
    ).toBe(true);
  });

  it('ロギングが変更された場合、クラスの状態とストレージの更新、メッセージの送信が行われること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.None);
    vi.spyOn(Storage, 'save').mockResolvedValue();
    vi.spyOn(Messenger, 'cast').mockResolvedValue();
    const container = await LoggingOptions.build();
    document.documentElement.appendChild(container);
    const none = document.getElementById(LoggingKinds.None) as HTMLDivElement;
    const error = document.getElementById(LoggingKinds.Error) as HTMLDivElement;
    const all = document.getElementById(LoggingKinds.All) as HTMLDivElement;

    const radio = container.querySelector(
      `input[value="${LoggingKinds.Error}"]`
    ) as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(none.classList.contains('other')).toBe(true);
      expect(error.classList.contains('other')).toBe(false);
      expect(all.classList.contains('other')).toBe(true);
      expect(Storage.save).toHaveBeenCalledWith({ logging: LoggingKinds.Error });
      expect(Messenger.cast).toHaveBeenCalledWith({
        kind: MessageKinds.Logging,
        value: LoggingKinds.Error,
        logger: {
          level: LogLevels.Info,
          value: expect.any(String),
        },
      });
    });
  });
});
