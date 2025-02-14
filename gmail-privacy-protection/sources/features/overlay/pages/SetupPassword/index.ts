import { PrimaryButton, Toast } from '@/components';
import { PageComponent } from '@/definitions';
import { NotFoundElement, ValidationFailed } from '@/exceptions';
import { addErrorClass, Storage, submit } from '@/utilities';

import { Overlay } from '../..';
import { Password, Title } from '../../components';
import { Rules, TitleSections } from '../../constants';
import { ProtectPrivacy } from '../ProtectPrivacy';

export class SetupPassword extends PageComponent {
  static async render() {
    const PageTitle = Title.build(TitleSections.SetupPassword);
    const InputPassword = Password.build({
      id: 'password',
      placeholder: 'パスワード',
      autocomplete: 'new-password',
    });
    const SetupPasswordButton = PrimaryButton.build({
      id: 'setup-password',
      label: '設定する',
    });

    const GppContainer = document.createElement('div');
    GppContainer.className = 'gpp-container height-auto';

    const GppForm = document.createElement('form');
    GppForm.className = 'gpp-form';
    GppForm.addEventListener('submit', (e) => {
      submit({
        e,
        button: SetupPasswordButton,
        callback: async () => {
          const input = InputPassword.querySelector('input') as HTMLInputElement;

          if (!input) throw new NotFoundElement();

          if (Rules.PasswordTooShort.isFailed(input.value)) {
            Toast.error(Rules.PasswordTooShort.message);

            addErrorClass(input);

            input.value = '';

            throw new ValidationFailed();
          }

          await Storage.save({ mode: { value: input.value } });

          await ProtectPrivacy.render();
        },
      });
    });

    GppForm.appendChild(InputPassword);
    GppForm.appendChild(SetupPasswordButton);
    GppContainer.appendChild(PageTitle);
    GppContainer.appendChild(GppForm);

    await Overlay.replace(GppContainer);
  }
}
