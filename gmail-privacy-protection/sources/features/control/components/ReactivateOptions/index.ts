import {
  LogLevels,
  MessageKinds,
  ReactivateInactives,
  ReactivateKinds,
  ReactivateKindVariants,
} from '@/constants';
import { ReactivateKind } from '@/definitions';
import { Component, Messenger, Storage } from '@/utilities';

import { TimerOptions } from './TimerOptions';

export class ReactivateOptions extends Component {
  static async build() {
    const reactivate = await Storage.getOne('reactivate');

    const OptionsOfTimer = await TimerOptions.build();

    const GppControlOptions = document.createElement('div');
    GppControlOptions.className = 'gpp-control-options';

    const GppControlOptionsTitle = document.createElement('div');
    GppControlOptionsTitle.className = 'gpp-control-options-title';
    GppControlOptionsTitle.textContent = '自動再開';
    GppControlOptions.appendChild(GppControlOptionsTitle);

    ReactivateKindVariants.forEach(({ value, label }) => {
      const checked = value === reactivate.kind;

      const GppControlOptionColWrapper = document.createElement('div');
      GppControlOptionColWrapper.id = value;
      GppControlOptionColWrapper.className = `gpp-control-option-col-wrapper ${checked ? '' : 'other'}`;

      const GppControlOption = document.createElement('label');
      GppControlOption.className = 'gpp-control-option';

      const GppControlKindOptionInput = document.createElement('input');
      GppControlKindOptionInput.type = 'radio';
      GppControlKindOptionInput.name = 'kind';
      GppControlKindOptionInput.value = value;
      GppControlKindOptionInput.checked = checked;
      GppControlKindOptionInput.id = `${value}-kind`;
      GppControlKindOptionInput.addEventListener('change', async (e) => {
        const OtherKinds = ReactivateKindVariants.map(
          (kind) => kind.value !== value && document.getElementById(kind.value)
        ).filter((element) => !!element);

        const input = e.target as HTMLInputElement;

        if (input.checked) {
          OtherKinds.forEach((element) => {
            element.classList.add('other');
          });
          GppControlOptionColWrapper.classList.remove('other');

          const kind = input.value as ReactivateKind;

          await Storage.save({
            reactivate: {
              kind,
              inactive:
                kind === ReactivateKinds.Inactive
                  ? ReactivateInactives.On
                  : ReactivateInactives.Off,
            },
          });

          await Messenger.cast({
            kind: MessageKinds.Reactivate,
            value: kind,
            logger: {
              level: LogLevels.Info,
              value: `自動再開を"${label}"に変更しました`,
            },
          });
        }
      });

      const GppControlKindOptionText = document.createElement('span');
      GppControlKindOptionText.textContent = label;

      GppControlOption.appendChild(GppControlKindOptionInput);
      GppControlOption.appendChild(GppControlKindOptionText);
      GppControlOptionColWrapper.appendChild(GppControlOption);
      value === ReactivateKinds.Timer && GppControlOptionColWrapper.appendChild(OptionsOfTimer);
      GppControlOptions.appendChild(GppControlOptionColWrapper);
    });

    return GppControlOptions;
  }
}
