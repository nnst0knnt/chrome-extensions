import { LogLevels, MessageKinds, ModeKindVariants } from '@/constants';
import { Component, ModeKind } from '@/definitions';
import { Messenger, Storage } from '@/utilities';

export class ModeOptions extends Component {
  static async build() {
    const mode = await Storage.getOne('mode');

    const GppControlOptions = document.createElement('div');
    GppControlOptions.className = 'gpp-control-options';

    const GppControlOptionsTitle = document.createElement('div');
    GppControlOptionsTitle.className = 'gpp-control-options-title';
    GppControlOptionsTitle.textContent = '解除方法';
    GppControlOptions.appendChild(GppControlOptionsTitle);

    ModeKindVariants.forEach(({ value, label }) => {
      const checked = value === mode.kind;

      const GppControlOptionColWrapper = document.createElement('div');
      GppControlOptionColWrapper.id = `${value}-${label}`;
      GppControlOptionColWrapper.className = `gpp-control-option-col-wrapper ${checked ? '' : 'other'}`;

      const GppControlOption = document.createElement('label');
      GppControlOption.className = 'gpp-control-option';

      const GppControlModeOptionInput = document.createElement('input');
      GppControlModeOptionInput.type = 'radio';
      GppControlModeOptionInput.name = 'mode';
      GppControlModeOptionInput.value = value;
      GppControlModeOptionInput.checked = checked;
      GppControlModeOptionInput.id = `${value}-mode`;
      GppControlModeOptionInput.addEventListener('change', async (e) => {
        const OtherKinds = ModeKindVariants.map(
          (kind) => kind.value !== value && document.getElementById(`${kind.value}-${kind.label}`)
        ).filter((element) => !!element);

        const input = e.target as HTMLInputElement;

        if (input.checked) {
          OtherKinds.forEach((element) => {
            element.classList.add('other');
          });
          GppControlOptionColWrapper.classList.remove('other');

          const mode = input.value as ModeKind;

          await Storage.save({ mode: { kind: mode } });

          await Messenger.cast({
            kind: MessageKinds.Mode,
            value: mode,
            logger: {
              level: LogLevels.Info,
              value: `解除方法を"${label}"に変更しました`,
            },
          });
        }
      });

      const GppControlModeOptionText = document.createElement('span');
      GppControlModeOptionText.textContent = label;

      GppControlOption.appendChild(GppControlModeOptionInput);
      GppControlOption.appendChild(GppControlModeOptionText);
      GppControlOptionColWrapper.appendChild(GppControlOption);
      GppControlOptions.appendChild(GppControlOptionColWrapper);
    });

    return GppControlOptions;
  }
}
