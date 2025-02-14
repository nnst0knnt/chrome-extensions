import { LogLevels, MessageKinds, ReactivateKinds, ReactivateTimerVariants } from '@/constants';
import { Component, ReactivateTimer } from '@/definitions';
import { Messenger, Storage } from '@/utilities';

export class TimerOptions extends Component {
  static async build() {
    const reactivate = await Storage.getOne('reactivate');
    const checked = reactivate.kind === ReactivateKinds.Timer;

    const GppControlOptions = document.createElement('div');
    GppControlOptions.className = `gpp-control-options ${checked ? '' : 'disabled'}`;

    ReactivateTimerVariants.forEach(({ value, label }) => {
      const GppControlOptionLabel = document.createElement('label');
      GppControlOptionLabel.className = 'gpp-control-option secondary';

      const GppControlTimerOptionInput = document.createElement('input');
      GppControlTimerOptionInput.type = 'radio';
      GppControlTimerOptionInput.name = 'timer';
      GppControlTimerOptionInput.value = String(value);
      GppControlTimerOptionInput.checked = value === reactivate.timer;
      GppControlTimerOptionInput.id = `${value}-timer`;
      GppControlTimerOptionInput.addEventListener('change', async (e) => {
        const input = e.target as HTMLInputElement;

        if (input.checked) {
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

      GppControlOptionLabel.appendChild(GppControlTimerOptionInput);
      GppControlOptionLabel.appendChild(GppControlTimerOptionText);
      GppControlOptions.appendChild(GppControlOptionLabel);
    });

    return GppControlOptions;
  }
}
