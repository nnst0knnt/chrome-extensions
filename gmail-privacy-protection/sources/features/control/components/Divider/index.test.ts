import { describe, it, expect } from 'vitest';

import { Divider } from '.';

describe('Divider', () => {
  it('正しいクラス名を持つdiv要素を生成すること', () => {
    const divider = Divider.build();

    expect(divider).toBeInstanceOf(HTMLDivElement);
    expect(divider.className).toBe('gpp-control-divider');
  });
});
