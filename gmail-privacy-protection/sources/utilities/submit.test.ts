import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AppException } from '@/exceptions';
import { Logger } from '@/utilities';

import { submit } from './submit';

describe('submit', () => {
  let e: SubmitEvent;
  let button: HTMLButtonElement;

  beforeEach(() => {
    e = { preventDefault: vi.fn() } as unknown as SubmitEvent;
    button = document.createElement('button');
    vi.spyOn(Logger, 'error').mockImplementation(async () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('イベントのデフォルト動作を防止すること', async () => {
    await submit({
      e,
      button,
      callback: vi.fn(),
    });

    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('コールバック実行中はボタンを無効化すること', async () => {
    const callback = vi.fn().mockImplementation(() => {
      expect(button.disabled).toBe(true);
      return Promise.resolve();
    });

    await submit({ e, button, callback });

    expect(callback).toHaveBeenCalled();
  });

  it('コールバック完了後にボタンを再度有効化すること', async () => {
    await submit({
      e,
      button,
      callback: vi.fn(),
    });

    expect(button.disabled).toBe(false);
  });

  it('コールバックでエラーが発生した場合でもボタンを再度有効化すること', async () => {
    await submit({
      e,
      button,
      callback: vi.fn().mockRejectedValue(new Error('コールバック内のエラー')),
    });

    expect(button.disabled).toBe(false);
  });

  it('AppExceptionが発生した場合、ログにエラーメッセージを記録すること', async () => {
    await submit({
      e,
      button,
      callback: vi
        .fn()
        .mockRejectedValue(
          Object.assign(new AppException(), { message: 'カスタムエラーメッセージ' })
        ),
    });

    expect(Logger.error).toHaveBeenCalledWith('カスタムエラーメッセージ');
  });

  it('ボタンが既に無効化されている場合、コールバックを実行しないこと', async () => {
    button.disabled = true;
    const callback = vi.fn();

    await submit({ e, button, callback });

    expect(callback).not.toHaveBeenCalled();
  });

  it('非同期のコールバック関数が実行されること', async () => {
    let completed = false;
    const callback = vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      completed = true;
    });

    await submit({ e, button, callback });

    expect(completed).toBe(true);
    expect(button.disabled).toBe(false);
  });
});
