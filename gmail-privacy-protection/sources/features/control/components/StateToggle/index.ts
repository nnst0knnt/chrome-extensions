import { LogLevels, MessageKinds } from '@/constants';
import { Component } from '@/utilities';
import { Messenger, Storage } from '@/utilities';

export class StateToggle extends Component {
  static async build() {
    const GppControlToggleWrapper = document.createElement('label');
    GppControlToggleWrapper.className = 'gpp-control-toggle-wrapper';

    const GppControlToggle = document.createElement('div');
    GppControlToggle.className = 'gpp-control-toggle';

    const GppControlToggleInput = document.createElement('input');
    GppControlToggleInput.type = 'checkbox';
    GppControlToggleInput.id = 'gpp-control-toggle-input';
    GppControlToggleInput.checked = await Storage.getOne('enabled');
    GppControlToggleInput.addEventListener('change', async (e) => {
      const enabled = (e.target as HTMLInputElement).checked;

      await Storage.save({ enabled });

      await Messenger.cast({
        kind: MessageKinds.State,
        value: enabled,
        logger: {
          level: LogLevels.Info,
          value: `プライバシー保護を"${enabled ? '有効' : '無効'}"にしました`,
        },
      });
    });

    const GppControlToggleSlider = document.createElement('span');
    GppControlToggleSlider.className = 'gpp-control-toggle-slider';

    GppControlToggle.appendChild(GppControlToggleInput);
    GppControlToggle.appendChild(GppControlToggleSlider);
    GppControlToggleWrapper.appendChild(GppControlToggle);

    return GppControlToggleWrapper;
  }
}
