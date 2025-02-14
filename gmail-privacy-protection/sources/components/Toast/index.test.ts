import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Toast } from '.';

describe('Toast', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('エラーメッセージを表示する要素を生成すること', () => {
    const message = 'エラーが発生しました';

    Toast.error(message);

    const toast = document.querySelector('.gpp-toast');
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toBe(message);
    expect(toast?.className).toBe('gpp-toast');
    expect(document.body.contains(toast)).toBe(true);
  });

  it('指定時間後に要素を削除すること', () => {
    Toast.error('エラーメッセージ', 2000);

    const toast = document.querySelector('.gpp-toast');
    expect(document.body.contains(toast)).toBe(true);
    vi.advanceTimersByTime(1999);
    expect(document.body.contains(toast)).toBe(true);
    vi.advanceTimersByTime(1);
    expect(document.body.contains(toast)).toBe(false);
  });

  it('デフォルト時間（3000ms）後に要素を削除すること', () => {
    Toast.error('エラーメッセージ');

    const toast = document.querySelector('.gpp-toast');
    expect(document.body.contains(toast)).toBe(true);
    vi.advanceTimersByTime(2999);
    expect(document.body.contains(toast)).toBe(true);
    vi.advanceTimersByTime(1);
    expect(document.body.contains(toast)).toBe(false);
  });
});
