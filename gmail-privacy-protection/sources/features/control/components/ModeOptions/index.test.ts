import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { LogLevels, MessageKinds, ModeKindVariants, ModeKinds } from '@/constants';
import { Messenger, Storage } from '@/utilities';

import { ModeOptions } from '.';

describe('ModeOptions', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('現在の解除方法に基づき、選択肢を生成すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({ kind: ModeKinds.Click, value: null });

    const container = await ModeOptions.build();
    document.documentElement.appendChild(container);

    expect(container).toBeInstanceOf(HTMLDivElement);
    expect(container.className).toBe('gpp-control-options');
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(ModeKindVariants.length);
    expect(
      (container.querySelector(`input[value="${ModeKinds.Click}"]`) as HTMLInputElement).checked
    ).toBe(true);
  });

  it('解除方法が変更された場合、クラスの状態とストレージの更新、メッセージの送信が行われること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({ kind: ModeKinds.Click, value: null });
    vi.spyOn(Storage, 'save').mockResolvedValue();
    vi.spyOn(Messenger, 'cast').mockResolvedValue();
    const container = await ModeOptions.build();
    document.documentElement.appendChild(container);
    const click = document.getElementById(ModeKinds.Click) as HTMLDivElement;
    const password = document.getElementById(ModeKinds.Password) as HTMLDivElement;

    const radio = container.querySelector(
      `input[value="${ModeKinds.Password}"]`
    ) as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(click.classList.contains('other')).toBe(true);
      expect(password.classList.contains('other')).toBe(false);
      expect(Storage.save).toHaveBeenCalledWith({ mode: { kind: ModeKinds.Password } });
      expect(Messenger.cast).toHaveBeenCalledWith({
        kind: MessageKinds.Mode,
        value: ModeKinds.Password,
        logger: {
          level: LogLevels.Info,
          value: expect.any(String),
        },
      });
    });
  });
});
