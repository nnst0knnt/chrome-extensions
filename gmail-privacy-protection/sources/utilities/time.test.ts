import { describe, it, expect } from 'vitest';

import { toSeconds, toMinutes } from './time';

describe('toSeconds', () => {
  it('ミリ秒を秒に変換できること', () => {
    expect(toSeconds(1000)).toBe(1);
    expect(toSeconds(2500)).toBe(2);
    expect(toSeconds(0)).toBe(0);
    expect(toSeconds(500)).toBe(0);
  });

  it('端数は切り捨てられること', () => {
    expect(toSeconds(1500)).toBe(1);
    expect(toSeconds(999)).toBe(0);
  });
});

describe('toMinutes', () => {
  it('ミリ秒を分に変換できること', () => {
    expect(toMinutes(60000)).toBe(1);
    expect(toMinutes(120000)).toBe(2);
    expect(toMinutes(0)).toBe(0);
  });

  it('端数付きの分を計算できること', () => {
    expect(toMinutes(30000)).toBe(0.5);
    expect(toMinutes(90000)).toBe(1.5);
  });
});
