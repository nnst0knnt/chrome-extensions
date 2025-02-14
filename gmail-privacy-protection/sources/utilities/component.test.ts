import { describe, it, expect, beforeEach } from 'vitest';

import {
  NotFoundElement,
  StaticBuildMethodNotImplemented,
  StaticRenderMethodNotImplemented,
  StaticStartMethodNotImplemented,
} from '@/exceptions';

import { Component, PageComponent, EntryComponent } from './component';

describe('Component', () => {
  class ValidComponent extends Component {
    static build() {
      const div = document.createElement('div');
      this._element = div;

      return div;
    }
  }
  class InvalidComponent extends Component {}

  beforeEach(() => {
    ValidComponent['_element'] = null;
  });

  it('_elementが設定された状態でelementを呼び出した場合、_elementを返却すること', () => {
    const component = ValidComponent.build();

    expect(ValidComponent.element).toBe(component);
  });

  it('buildメソッドを持たないコンポーネントの場合、エラーをスローすること', () => {
    expect(() => new InvalidComponent()).toThrow(StaticBuildMethodNotImplemented);
  });

  it('_elementが未設定の状態でelementを呼び出した場合、エラーをスローすること', () => {
    class ExtendedComponent extends ValidComponent {}

    expect(() => ExtendedComponent.element).toThrow(NotFoundElement);
  });
});

describe('PageComponent', () => {
  class ValidPageComponent extends PageComponent {
    static render() {
      const div = document.createElement('div');
      this._element = div;

      return div;
    }
  }
  class InvalidPageComponent extends PageComponent {}

  beforeEach(() => {
    ValidPageComponent['_element'] = null;
  });

  it('_elementが設定された状態でelementを呼び出した場合、_elementを返却すること', () => {
    const component = ValidPageComponent.render();

    expect(ValidPageComponent.element).toBe(component);
  });

  it('renderメソッドを持たないページコンポーネントの場合、エラーをスローすること', () => {
    expect(() => new InvalidPageComponent()).toThrow(StaticRenderMethodNotImplemented);
  });

  it('_elementが未設定の状態でelementを呼び出した場合、エラーをスローすること', () => {
    class ExtendedPageComponent extends ValidPageComponent {}

    expect(() => ExtendedPageComponent.element).toThrow(NotFoundElement);
  });
});

describe('EntryComponent', () => {
  class ValidEntryComponent extends EntryComponent {
    static async start() {
      const div = document.createElement('div');
      this._element = div;

      return div;
    }
  }
  class InvalidEntryComponent extends EntryComponent {}

  beforeEach(() => {
    ValidEntryComponent['_element'] = null;
  });

  it('_elementが設定された状態でelementを呼び出した場合、_elementを返却すること', async () => {
    const component = await ValidEntryComponent.start();

    expect(ValidEntryComponent.element).toBe(component);
  });

  it('replaceメソッドで_elementの子要素を置き換えること', async () => {
    await ValidEntryComponent.start();
    const span = document.createElement('span');
    span.textContent = 'テスト';

    ValidEntryComponent.replace(span);

    expect(ValidEntryComponent.element.children.length).toBe(1);
    expect(ValidEntryComponent.element.firstChild).toBe(span);
  });

  it('replaceメソッドで複数の子要素を置き換えること', async () => {
    await ValidEntryComponent.start();
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const textNode = 'テキストノード';

    ValidEntryComponent.replace(span1, span2, textNode);

    expect(ValidEntryComponent.element.childNodes.length).toBe(3);
    expect(ValidEntryComponent.element.childNodes[0]).toBe(span1);
    expect(ValidEntryComponent.element.childNodes[1]).toBe(span2);
    expect(ValidEntryComponent.element.childNodes[2].textContent).toBe(textNode);
  });

  it('startメソッドを持たないコンポーネントの場合、エラーをスローすること', () => {
    expect(() => new InvalidEntryComponent()).toThrow(StaticStartMethodNotImplemented);
  });

  it('_elementが未設定の状態でelementを呼び出した場合、エラーをスローすること', () => {
    class ExtendedEntryComponent extends ValidEntryComponent {}

    expect(() => ExtendedEntryComponent.element).toThrow(NotFoundElement);
  });

  it('_elementが未設定の状態でreplaceメソッドを呼び出した場合、エラーをスローすること', () => {
    class ExtendedEntryComponent extends ValidEntryComponent {}

    expect(() => ExtendedEntryComponent.replace(document.createElement('span'))).toThrow(
      NotFoundElement
    );
  });
});
