import { AppException } from './AppException';

export class StaticBuildMethodNotImplemented extends AppException {
  name = 'StaticBuildMethodNotImplemented';

  code = 500;

  message = 'staticなbuildメソッドが実装されていません';

  constructor(className: string) {
    super();

    this.message = `${className}クラスにstaticなbuildメソッドが実装されていません`;
  }
}
