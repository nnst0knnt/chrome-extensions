import {
  NotFoundElement,
  StaticBuildMethodNotImplemented,
  StaticRenderMethodNotImplemented,
  StaticStartMethodNotImplemented,
} from '@/exceptions';

type BuildableComponent = {
  new (): unknown;
  build: () => void;
};

export abstract class Component {
  protected static _element: HTMLElement | null = null;

  constructor() {
    const constructor = this.constructor as BuildableComponent;

    if (typeof constructor.build !== 'function') {
      throw new StaticBuildMethodNotImplemented(constructor.name);
    }
  }

  static get element() {
    if (!this._element) throw new NotFoundElement();

    return this._element;
  }
}

type RenderableComponent = {
  new (): unknown;
  render: () => void;
};

export abstract class PageComponent {
  protected static _element: HTMLElement | null = null;

  constructor() {
    const constructor = this.constructor as RenderableComponent;

    if (typeof constructor.render !== 'function') {
      throw new StaticRenderMethodNotImplemented(constructor.name);
    }
  }

  static get element() {
    if (!this._element) throw new NotFoundElement();

    return this._element;
  }
}

type StartableComponent = {
  new (): unknown;
  start: () => Promise<void>;
};

export abstract class EntryComponent {
  protected static _element: HTMLElement | null = null;

  constructor() {
    const constructor = this.constructor as StartableComponent;

    if (typeof constructor.start !== 'function') {
      throw new StaticStartMethodNotImplemented(constructor.name);
    }
  }

  static replace(...nodes: (Node | string)[]) {
    if (!this._element) throw new NotFoundElement();

    this._element.replaceChildren(...nodes);
  }

  static get element() {
    if (!this._element) throw new NotFoundElement();

    return this._element;
  }
}
