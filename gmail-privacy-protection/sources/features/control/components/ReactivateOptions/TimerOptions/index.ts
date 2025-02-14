import { LogLevels, MessageKinds, ReactivateKinds, ReactivateTimerVariants } from '@/constants';
import { ReactivateTimer } from '@/definitions';
import { Component, Messenger, Storage } from '@/utilities';

export class TimerOptions extends Component {
  static async build() {
    const reactivate = await Storage.getOne('reactivate');
    const checked = reactivate.kind === ReactivateKinds.Timer;

    const GppControlOptions = document.createElement('div');
    GppControlOptions.className = `gpp-control-options ${checked ? '' : 'disabled'}`;

    ReactivateTimerVariants.forEach(({ value, label }) => {
      const checked = value === reactivate.timer;

      const GppControlOptionColWrapper = document.createElement('div');
      GppControlOptionColWrapper.id = String(value);
      GppControlOptionColWrapper.className = `gpp-control-option-col-wrapper ${checked ? '' : 'other'}`;

      const GppControlOption = document.createElement('label');
      GppControlOption.className = 'gpp-control-option secondary';

      const GppControlTimerOptionInput = document.createElement('input');
      GppControlTimerOptionInput.type = 'radio';
      GppControlTimerOptionInput.name = 'timer';
      GppControlTimerOptionInput.value = String(value);
      GppControlTimerOptionInput.checked = value === reactivate.timer;
      GppControlTimerOptionInput.id = `${value}-timer`;
      GppControlTimerOptionInput.addEventListener('change', async (e) => {
        const OtherTimers = ReactivateTimerVariants.map(
          (timer) => timer.value !== value && document.getElementById(String(timer.value))
        ).filter((element) => !!element);

        const input = e.target as HTMLInputElement;

        if (input.checked) {
          OtherTimers.forEach((element) => {
            element.classList.add('other');
          });
          GppControlOptionColWrapper.classList.remove('other');

          const timer = Number(input.value) as ReactivateTimer;

          await Storage.save({ reactivate: { timer } });

          await Messenger.cast({
            kind: MessageKinds.Reactivate,
            value: timer,
            logger: {
              level: LogLevels.Info,
              value: `タイマーを"${label}"に変更しました`,
            },
          });
        }
      });

      const GppControlTimerOptionText = document.createElement('span');
      GppControlTimerOptionText.textContent = label;

      GppControlOption.appendChild(GppControlTimerOptionInput);
      GppControlOption.appendChild(GppControlTimerOptionText);
      GppControlOptionColWrapper.appendChild(GppControlOption);
      GppControlOptions.appendChild(GppControlOptionColWrapper);
    });

    return GppControlOptions;
  }
}
