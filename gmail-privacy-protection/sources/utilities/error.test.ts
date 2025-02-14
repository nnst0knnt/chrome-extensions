import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { addErrorClass } from './error';

describe('addErrorClass', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('指定された要素にerrorクラスを追加すること', () => {
    addErrorClass(element);

    expect(element.classList.contains('error')).toBe(true);
  });

  it('追加のクラス名を指定できること', () => {
    addErrorClass(element, { classNames: ['custom-error', 'highlight'] });

    expect(element.classList.contains('error')).toBe(true);
    expect(element.classList.contains('custom-error')).toBe(true);
    expect(element.classList.contains('highlight')).toBe(true);
  });

  it('デフォルトでは3000ミリ秒後にerrorクラスが削除されること', () => {
    addErrorClass(element);

    expect(element.classList.contains('error')).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(element.classList.contains('error')).toBe(false);
  });

  it('指定した時間後にerrorクラスが削除されること', () => {
    addErrorClass(element, { duration: 5000 });

    expect(element.classList.contains('error')).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(element.classList.contains('error')).toBe(true);
    vi.advanceTimersByTime(2000);
    expect(element.classList.contains('error')).toBe(false);
  });

  it('errorクラスのみが削除され追加クラスは残ること', () => {
    addErrorClass(element, { classNames: ['remain-class'] });

    expect(element.classList.contains('error')).toBe(true);
    expect(element.classList.contains('remain-class')).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(element.classList.contains('error')).toBe(false);
    expect(element.classList.contains('remain-class')).toBe(true);
  });
});
