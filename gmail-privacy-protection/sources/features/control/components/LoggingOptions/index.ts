import { LoggingKindVariants, LogLevels, MessageKinds } from '@/constants';
import { LoggingKind } from '@/definitions';
import { Component, Messenger, Storage } from '@/utilities';

export class LoggingOptions extends Component {
  static async build() {
    const logging = await Storage.getOne('logging');

    const GppControlOptions = document.createElement('div');
    GppControlOptions.className = 'gpp-control-options';

    const GppControlOptionsTitle = document.createElement('div');
    GppControlOptionsTitle.className = 'gpp-control-options-title';
    GppControlOptionsTitle.textContent = 'ロギング';
    GppControlOptions.appendChild(GppControlOptionsTitle);

    LoggingKindVariants.forEach(({ value, label }) => {
      const checked = value === logging;

      const GppControlOptionColWrapper = document.createElement('div');
      GppControlOptionColWrapper.id = value;
      GppControlOptionColWrapper.className = `gpp-control-option-col-wrapper ${checked ? '' : 'other'}`;

      const GppControlOption = document.createElement('label');
      GppControlOption.className = 'gpp-control-option';

      const GppControlLoggingOptionInput = document.createElement('input');
      GppControlLoggingOptionInput.type = 'radio';
      GppControlLoggingOptionInput.name = 'logging';
      GppControlLoggingOptionInput.value = value;
      GppControlLoggingOptionInput.checked = checked;
      GppControlLoggingOptionInput.id = `${value}-logging`;
      GppControlLoggingOptionInput.addEventListener('change', async (e) => {
        const OtherLoggings = LoggingKindVariants.map(
          (logging) => logging.value !== value && document.getElementById(logging.value)
        ).filter((element) => !!element);

        const input = e.target as HTMLInputElement;

        if (input.checked) {
          OtherLoggings.forEach((element) => {
            element.classList.add('other');
          });
          GppControlOptionColWrapper.classList.remove('other');

          const logging = input.value as LoggingKind;

          await Storage.save({ logging });

          await Messenger.cast({
            kind: MessageKinds.Logging,
            value: logging,
            logger: {
              level: LogLevels.Info,
              value: `ロギングを"${label}"に変更しました`,
            },
          });
        }
      });

      const GppControlLoggingOptionText = document.createElement('span');
      GppControlLoggingOptionText.textContent = label;

      GppControlOption.appendChild(GppControlLoggingOptionInput);
      GppControlOption.appendChild(GppControlLoggingOptionText);
      GppControlOptionColWrapper.appendChild(GppControlOption);
      GppControlOptions.appendChild(GppControlOptionColWrapper);
    });

    return GppControlOptions;
  }
}
