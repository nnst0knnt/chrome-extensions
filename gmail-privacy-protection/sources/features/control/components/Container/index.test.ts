import { describe, it, expect } from 'vitest';

import { Container } from '.';

describe('Container', () => {
  it('正しいクラス名を持つdiv要素を生成すること', () => {
    const container = Container.build();

    expect(container).toBeInstanceOf(HTMLDivElement);
    expect(container.className).toBe('gpp-control-container');
  });
});
