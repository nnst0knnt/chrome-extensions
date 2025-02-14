import { AppException } from './AppException';

export class ValidationFailed extends AppException {
  name = 'ValidationFailed';

  code = 400;

  message = 'バリデーションに失敗しました';

  constructor() {
    super();
  }
}
