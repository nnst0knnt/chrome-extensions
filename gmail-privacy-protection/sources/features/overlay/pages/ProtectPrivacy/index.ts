import { PrimaryButton, SecondaryButton, Toast } from '@/components';
import { ModeKinds } from '@/constants';
import { PageComponent } from '@/definitions';
import { NotFoundElement, ValidationFailed } from '@/exceptions';
import { addErrorClass, Storage, submit } from '@/utilities';

import { Overlay } from '../..';
import { Password, Title } from '../../components';
import { Rules, TitleSections } from '../../constants';
import { ChangePassword } from '../ChangePassword';

export class ProtectPrivacy extends PageComponent {
  static async render() {
    const { mode } = await Storage.get('mode');

    if (mode.kind === ModeKinds.Click) {
      await this.forClick();
    } else {
      await this.forPassword();
    }
  }

  private static async forClick() {
    const PageTitle = Title.build(TitleSections.ProtectPrivacy);
    const ClearOverlayButton = PrimaryButton.build({
      id: 'clear-overlay',
      label: '閉じる',
      handler: () => Overlay.close(),
    });

    const GppContainer = document.createElement('div');
    GppContainer.className = 'gpp-container height-auto';

    GppContainer.appendChild(PageTitle);
    GppContainer.appendChild(ClearOverlayButton);

    await Overlay.replace(GppContainer);
  }

  private static async forPassword() {
    const PageTitle = Title.build(TitleSections.ProtectPrivacy);
    const InputPassword = Password.build({
      id: 'input-password',
      placeholder: 'パスワード',
      autocomplete: 'current-password',
    });
    const ClearOverlayButton = PrimaryButton.build({
      id: 'clear-overlay',
      label: '閉じる',
    });
    const ToChangePasswordButton = SecondaryButton.build({
      id: 'change-password',
      label: 'パスワードを変更',
      handler: () => ChangePassword.render(),
    });

    const GppContainer = document.createElement('div');
    GppContainer.className = 'gpp-container';

    const GppForm = document.createElement('form');
    GppForm.className = 'gpp-form';
    GppForm.addEventListener('submit', (e) => {
      submit({
        e,
        button: ClearOverlayButton,
        callback: async () => {
          const input = InputPassword.querySelector('input') as HTMLInputElement;

          if (!input) throw new NotFoundElement();

          const mode = await Storage.getOne('mode');

          if (!mode.value) throw new ValidationFailed();

          if (Rules.PasswordInvalid.isFailed(input.value, mode.value)) {
            Toast.error(Rules.PasswordInvalid.message);

            addErrorClass(input);

            input.value = '';

            throw new ValidationFailed();
          }

          Overlay.close();
        },
      });
    });

    const GppActions = document.createElement('div');
    GppActions.className = 'gpp-actions';

    GppForm.appendChild(InputPassword);
    GppForm.appendChild(ClearOverlayButton);
    GppActions.appendChild(ToChangePasswordButton);
    GppContainer.appendChild(PageTitle);
    GppContainer.appendChild(GppForm);
    GppContainer.appendChild(GppActions);

    await Overlay.replace(GppContainer);
  }
}
