import { describe, it, expect, vi } from 'vitest';

import { PrimaryButton } from '.';

describe('PrimaryButton', () => {
  it('ボタン要素を生成すること', () => {
    const button = PrimaryButton.build({
      id: 'primary-button',
      label: 'テストボタン',
    });

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.className).toBe('gpp-button');
    expect(button.id).toBe('primary-button');
    expect(button.textContent).toBe('テストボタン');
    expect(button.type).toBe('submit');
  });

  it('指定したタイプのボタン要素を生成すること', () => {
    const button = PrimaryButton.build({
      id: 'primary-button',
      label: 'テストボタン',
      type: 'button',
    });

    expect(button.type).toBe('button');
  });

  it('ハンドラーが設定されたボタン要素を生成すること', () => {
    const handler = vi.fn();
    const button = PrimaryButton.build({
      id: 'primary-button',
      label: 'テストボタン',
      handler,
    });

    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ハンドラーを指定しない場合、エラーが発生しないこと', () => {
    const button = PrimaryButton.build({
      id: 'primary-button',
      label: 'テストボタン',
    });

    expect(() => button.click()).not.toThrow();
  });
});
