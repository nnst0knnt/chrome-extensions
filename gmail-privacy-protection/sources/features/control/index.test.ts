import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Themes } from '@/constants';
import { Storage } from '@/utilities';

import { Home } from './pages';

import { Control } from '.';

describe('Control', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    Control['_element'] = null;
    vi.clearAllMocks();
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Light);
    vi.spyOn(Home, 'render').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('アプリケーションが起動されること', async () => {
    await Control.start();

    const element = document.querySelector('.gpp-control');
    expect(element).not.toBeNull();
    expect(Home.render).toHaveBeenCalledTimes(1);
  });

  it('ライトモードとしてアプリケーションが起動されること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Light);

    await Control.start();

    const element = document.querySelector('.gpp-control');
    expect(element?.className).toContain('light-mode');
    expect(element?.className).not.toContain('dark-mode');
  });

  it('ダークモードとしてアプリケーションが起動されること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(Themes.Dark);

    await Control.start();

    const element = document.querySelector('.gpp-control');
    expect(element?.className).toContain('dark-mode');
    expect(element?.className).not.toContain('light-mode');
  });

  it('複数回アプリケーションが起動されないこと', async () => {
    await Control.start();
    await vi.mocked(Storage.getOne).mockClear();
    await vi.mocked(Home.render).mockClear();

    await Control.start();

    expect(Storage.getOne).not.toHaveBeenCalled();
    expect(Home.render).not.toHaveBeenCalled();
    expect(document.querySelector('.gpp-control')).not.toBeNull();
  });
});
