import { AppException } from './AppException';

export class NotFoundElement extends AppException {
  name = 'NotFoundElement';

  code = 404;

  message = '要素が見つかりませんでした';

  constructor() {
    super();
  }
}
