import { describe, it, expect, vi } from 'vitest';

import { SecondaryButton } from '.';

describe('SecondaryButton', () => {
  it('ボタン要素を生成すること', () => {
    const button = SecondaryButton.build({
      id: 'secondary-button',
      label: 'テストボタン',
    });

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.className).toBe('gpp-button secondary');
    expect(button.id).toBe('secondary-button');
    expect(button.textContent).toBe('テストボタン');
  });

  it('ハンドラーが設定されたボタン要素を生成すること', () => {
    const handler = vi.fn();
    const button = SecondaryButton.build({
      id: 'secondary-button',
      label: 'テストボタン',
      handler,
    });

    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ハンドラーを指定しない場合、エラーが発生しないこと', () => {
    const button = SecondaryButton.build({
      id: 'secondary-button',
      label: 'テストボタン',
    });

    expect(() => button.click()).not.toThrow();
  });
});
