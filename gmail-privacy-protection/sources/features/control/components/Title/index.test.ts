import { describe, it, expect } from 'vitest';

import { Title } from '.';

describe('Title', () => {
  it('タイトル要素にアイコン、タイトル、サブタイトルが含まれていること', () => {
    const wrapper = Title.build();

    expect(wrapper.className).toBe('gpp-control-title-wrapper');
    expect(wrapper.querySelector('.gpp-control-symbol')).not.toBeNull();
    expect(wrapper.querySelector('.gpp-control-symbol')?.innerHTML).not.toBe('');
    expect(wrapper.querySelector('.gpp-control-title')).not.toBeNull();
    expect(wrapper.querySelector('.gpp-control-title')?.textContent).toBe(
      'Gmail Privacy Protection'
    );
    expect(wrapper.querySelector('.gpp-control-subtitle')).not.toBeNull();
    expect(wrapper.querySelector('.gpp-control-subtitle')?.textContent).toBe(
      '拡張機能の設定を変更できます'
    );
  });
});
