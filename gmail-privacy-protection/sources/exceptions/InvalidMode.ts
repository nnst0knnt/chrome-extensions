import { AppException } from './AppException';

export class InvalidMode extends AppException {
  name = 'InvalidMode';

  code = 400;

  message = '不正なモードです';

  constructor() {
    super();
  }
}
