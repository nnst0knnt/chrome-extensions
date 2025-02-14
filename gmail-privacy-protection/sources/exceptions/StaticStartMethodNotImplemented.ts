import { AppException } from './AppException';

export class StaticStartMethodNotImplemented extends AppException {
  name = 'StaticStartMethodNotImplemented';

  code = 500;

  message = 'staticなstartメソッドが実装されていません';

  constructor(className: string) {
    super();

    this.message = `${className}クラスにstaticなstartメソッドが実装されていません`;
  }
}
