import { describe, it, expect } from 'vitest';

import { Password } from '.';

describe('Password', () => {
  it('デフォルト設定でパスワード入力要素を生成すること', () => {
    const input = Password.build({ id: 'password' });
    const password = input.querySelector('input') as HTMLInputElement;
    const toggle = input.querySelector('button') as HTMLButtonElement;

    expect(input).toBeInstanceOf(HTMLDivElement);
    expect(input.className).toBe('gpp-input-wrapper');
    expect(password).not.toBeNull();
    expect(password.type).toBe('password');
    expect(password.className).toBe('gpp-input');
    expect(password.placeholder).toBe('パスワード');
    expect(password.autocomplete).toBe('off');
    expect(password.required).toBe(true);
    expect(toggle).not.toBeNull();
    expect(toggle.type).toBe('button');
    expect(toggle.innerHTML).toContain(Password.VISIBLE);
    expect(toggle.id).toBe('password');
    expect(toggle.className).toBe('gpp-symbol-button');
    expect(toggle.dataset.action).toBe('toggle-password');
  });

  it('パスワード表示と非表示が切り替えられること', () => {
    const input = Password.build({ id: 'toggle-password' });
    const password = input.querySelector('input') as HTMLInputElement;
    const toggle = input.querySelector('button') as HTMLButtonElement;

    expect(password.type).toBe('password');
    expect(toggle.innerHTML).toContain(Password.VISIBLE);
    toggle.click();
    expect(password.type).toBe('text');
    expect(toggle.innerHTML).toContain(Password.HIDDEN);
    toggle.click();
    expect(password.type).toBe('password');
    expect(toggle.innerHTML).toContain(Password.VISIBLE);
  });
});
