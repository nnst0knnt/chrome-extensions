import { AppException } from './AppException';

export class StaticRenderMethodNotImplemented extends AppException {
  name = 'StaticRenderMethodNotImplemented';

  code = 500;

  message = 'staticなrenderメソッドが実装されていません';

  constructor(className: string) {
    super();

    this.message = `${className}クラスにstaticなrenderメソッドが実装されていません`;
  }
}
