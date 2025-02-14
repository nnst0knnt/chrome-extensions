import { PrimaryButton, SecondaryButton, Toast } from '@/components';
import { NotFoundElement, ValidationFailed } from '@/exceptions';
import { addErrorClass, PageComponent, Storage, submit } from '@/utilities';

import { Overlay } from '../..';
import { Password, Title } from '../../components';
import { Rules, TitleSections } from '../../constants';
import { ProtectPrivacy } from '../ProtectPrivacy';

export class ChangePassword extends PageComponent {
  static async render() {
    const NewPassword = Password.build({
      id: 'new-password',
      placeholder: '新しいパスワード',
      autocomplete: 'new-password',
    });
    const ChangePasswordButton = PrimaryButton.build({
      id: 'change-password',
      label: '変更する',
    });

    const GppContainer = document.createElement('div');
    GppContainer.className = 'gpp-container';

    const GppForm = document.createElement('form');
    GppForm.className = 'gpp-form';
    GppForm.addEventListener('submit', (e) => {
      submit({
        e,
        button: ChangePasswordButton,
        callback: async () => {
          const newPassword = NewPassword.querySelector('input') as HTMLInputElement;

          if (!newPassword) throw new NotFoundElement();

          const mode = await Storage.getOne('mode');

          if (!mode.value) throw new ValidationFailed();

          if (Rules.PasswordTooShort.isFailed(newPassword.value)) {
            Toast.error(Rules.PasswordTooShort.message);

            addErrorClass(newPassword);

            newPassword.value = '';

            throw new ValidationFailed();
          }

          await Storage.save({ mode: { value: newPassword.value } });

          await ProtectPrivacy.render();
        },
      });
    });

    const GppActions = document.createElement('div');
    GppActions.className = 'gpp-actions';

    GppForm.appendChild(NewPassword);
    GppForm.appendChild(ChangePasswordButton);
    GppActions.appendChild(
      SecondaryButton.build({
        id: 'cancel',
        label: 'キャンセル',
        handler: () => ProtectPrivacy.render(),
      })
    );
    GppContainer.appendChild(Title.build(TitleSections.ChangePassword));
    GppContainer.appendChild(GppForm);
    GppContainer.appendChild(GppActions);

    await Overlay.replace(GppContainer);
  }
}
