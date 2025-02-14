import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Themes } from '@/constants';
import { NotFoundElement } from '@/exceptions';
import { Messenger, Storage } from '@/utilities';

import { ThemeToggle } from '.';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ThemeToggle['_element'] = null;
    ThemeToggle['_symbol'] = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ライトモードの要素を生成すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Light);

    const container = await ThemeToggle.build();

    expect(container).toBeInstanceOf(HTMLDivElement);
    expect(container.id).toBe('gpp-theme-container');
    expect(container.className).toContain('light-mode');
    expect(container.querySelector('.gpp-theme-button')).not.toBeNull();
    expect(container.querySelector('.gpp-theme-symbol')).not.toBeNull();
  });

  it('ダークモードの要素を生成すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Dark);

    const container = await ThemeToggle.build();

    expect(container.className).toContain('dark-mode');
  });

  it('固定位置に配置される要素を生成できること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Dark);

    const container = await ThemeToggle.build({ fixed: true });

    expect(container.className).toContain('fixed dark-mode');
  });

  it('現在の要素を削除して新しい要素を生成できること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Light);
    const container = await ThemeToggle.build();
    const remove = vi.spyOn(container, 'remove');

    const newContainer = await ThemeToggle.rebuild();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(newContainer).not.toBe(container);
    expect(newContainer.id).toBe('gpp-theme-container');
    expect(newContainer.className).toContain('light-mode');
  });

  it('テーマを切り替えられること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Light);
    vi.spyOn(Storage, 'save').mockResolvedValue();
    vi.spyOn(Messenger, 'cast').mockResolvedValue();
    document.body.innerHTML = '<div class="light-mode"></div><div class="light-mode"></div>';

    await ThemeToggle.build();
    await ThemeToggle.toggle();

    const elements = document.querySelectorAll('.dark-mode');
    expect(elements.length).toBe(2);
    expect(Storage.save).toHaveBeenCalledWith({ theme: Themes.Dark });
    expect(Messenger.cast).toHaveBeenCalled();
  });

  it('再生成時に要素が存在しない場合、エラーをスローすること', async () => {
    await expect(ThemeToggle.rebuild()).rejects.toThrow(NotFoundElement);
  });

  it('テーマ切り替え時に要素が存在しない場合、エラーをスローすること', async () => {
    await expect(ThemeToggle.toggle()).rejects.toThrow(NotFoundElement);
  });
});
