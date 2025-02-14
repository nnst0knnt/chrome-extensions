import { describe, it, expect } from 'vitest';

import { TitleSections } from '../../constants';

import { Title } from '.';

describe('Title', () => {
  it('セクション情報を使用してタイトル要素を生成すること', () => {
    const section = TitleSections.SetupPassword;
    const title = Title.build(section);
    const symbol = title.querySelector('.gpp-symbol');
    const message = title.querySelector('.gpp-message-wrapper');

    expect(title).toBeInstanceOf(HTMLDivElement);
    expect(title.className).toBe('gpp-title-wrapper');
    expect(symbol).not.toBeNull();
    expect(symbol?.innerHTML).toContain('svg');
    expect(message).not.toBeNull();
    expect(message?.querySelector('.gpp-primary-message')?.textContent).toBe(section.primary);
    expect(message?.querySelector('.gpp-secondary-message')?.textContent).toBe(section.secondary);
  });
});
