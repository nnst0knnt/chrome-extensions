import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { LogLevels, MessageKinds } from '@/constants';
import { Messenger, Storage } from '@/utilities';

import { StateToggle } from '.';

describe('StateToggle', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ストレージから取得した有効状態の初期値を反映すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(true);

    const label = await StateToggle.build();

    expect(label.className).toBe('gpp-control-toggle-wrapper');
    expect(label.querySelector('.gpp-control-toggle')).not.toBeNull();
    expect(label.querySelector('.gpp-control-toggle-slider')).not.toBeNull();
    const input = label.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('checkbox');
    expect(input.checked).toBe(true);
  });

  it('ストレージから取得した無効状態の初期値を反映すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(false);

    const label = await StateToggle.build();

    expect(label.className).toBe('gpp-control-toggle-wrapper');
    expect(label.querySelector('.gpp-control-toggle')).not.toBeNull();
    expect(label.querySelector('.gpp-control-toggle-slider')).not.toBeNull();
    const input = label.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('checkbox');
    expect(input.checked).toBe(false);
  });

  it('トグルした場合、ストレージを更新とメッセージの送信が行われること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(true);
    const save = vi.spyOn(Storage, 'save').mockResolvedValue();
    const cast = vi.spyOn(Messenger, 'cast').mockResolvedValue();
    const label = await StateToggle.build();
    document.documentElement.appendChild(label);

    const input = label.querySelector('input') as HTMLInputElement;
    input.checked = false;
    input.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(save).toHaveBeenCalledWith({ enabled: false });
      expect(cast).toHaveBeenCalledWith({
        kind: MessageKinds.State,
        value: false,
        logger: {
          level: LogLevels.Info,
          value: expect.any(String),
        },
      });
    });
  });
});
