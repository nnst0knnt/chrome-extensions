import { AppException } from '@/exceptions';

import { Logger } from './logger';

type SubmitArgs = {
  e: SubmitEvent;
  button: HTMLButtonElement;
  callback: (e: SubmitEvent) => Promise<void> | void;
};

export const submit = async ({ e, button, callback }: SubmitArgs) => {
  e.preventDefault();

  if (button.disabled) return;

  button.disabled = true;

  try {
    await callback(e);
  } catch (e) {
    if (e instanceof AppException) {
      Logger.error(e.message);

      return;
    }
  } finally {
    button.disabled = false;
  }
};
