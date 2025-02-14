import { ThemeToggle } from '@/components';
import { MessageKinds, ModeKinds, ReactivateKinds, Themes } from '@/constants';
import { InvalidMode, NotFoundElement } from '@/exceptions';
import { EntryComponent, Logger, Messenger, Storage, toMinutes } from '@/utilities';

import { ProtectPrivacy, SetupPassword } from './pages';

export class Overlay extends EntryComponent {
  private static timeout: number | null = null;

  static async start() {
    this.setup();

    const { enabled, theme } = await Storage.get('enabled', 'theme');

    Logger.info(`プライバシー保護は"${enabled ? '有効' : '無効'}"です`);

    if (this._element) return;

    const GppOverlay = document.createElement('div');
    GppOverlay.className = `gpp-overlay ${
      theme === Themes.Dark ? 'dark-mode' : 'light-mode'
    } ${enabled ? 'gpp-overlay-active' : 'gpp-overlay-inactive'}`;

    document.documentElement.appendChild(GppOverlay);

    this._element = GppOverlay;

    await this.render();
  }

  static async timer() {
    if (this.timeout) clearTimeout(this.timeout);

    const { enabled, reactivate } = await Storage.get('enabled', 'reactivate');

    const isTimer = enabled && reactivate.kind === ReactivateKinds.Timer && reactivate.timer > 0;

    this.timeout = isTimer ? window.setTimeout(() => this.active(), reactivate.timer) : null;

    return isTimer ? reactivate.timer : null;
  }

  static async close() {
    if (!this._element) throw new NotFoundElement();

    this._element.classList.remove('gpp-overlay-active');
    this._element.classList.add('gpp-overlay-inactive');

    const time = await this.timer();

    if (time) {
      Logger.info(`プライバシー保護は"${toMinutes(time)}分後"に有効になります`);
    }
  }

  static async active() {
    if (!this._element) throw new NotFoundElement();

    this._element.classList.remove('gpp-overlay-inactive');
    this._element.classList.add('gpp-overlay-active');

    await this.render();
  }

  static async replace(...nodes: (Node | string)[]) {
    super.replace(...nodes);

    this._element!.appendChild(await ThemeToggle.build({ fixed: true }));
  }

  private static async render() {
    const mode = await Storage.getOne('mode');

    if (mode.kind === ModeKinds.Password && !mode.value) {
      await SetupPassword.render();

      return;
    }

    if (mode.kind === ModeKinds.Click || (mode.kind === ModeKinds.Password && mode.value)) {
      await ProtectPrivacy.render();

      return;
    }

    throw new InvalidMode();
  }

  private static async setup() {
    Messenger.listen(async (message) => {
      if (!this._element) throw new NotFoundElement();

      switch (message.kind) {
        case MessageKinds.State:
          if (!message.value) {
            await this.close();
          } else {
            await this.active();
          }

          await this.timer();

          break;
        case MessageKinds.Mode:
          await this.render();

          break;
        case MessageKinds.Reactivate:
          if (
            message.value === ReactivateKinds.None ||
            message.value === ReactivateKinds.Inactive
          ) {
            this.timeout && clearTimeout(this.timeout);
            this.timeout = null;
          }

          if (message.value === ReactivateKinds.Timer) {
            await this.timer();
          }

          break;
        case MessageKinds.Theme:
          if (message.value === Themes.Dark) {
            this._element.classList.add('dark-mode');
            this._element.classList.remove('light-mode');
          } else {
            this._element.classList.add('light-mode');
            this._element.classList.remove('dark-mode');
          }

          this._element!.appendChild(await ThemeToggle.rebuild({ fixed: true }));

          break;
      }
    });

    document.addEventListener('visibilitychange', async () => {
      const { enabled, reactivate } = await Storage.get('enabled', 'reactivate');

      const isInactive = reactivate.kind === ReactivateKinds.Inactive;

      if (!enabled || !isInactive) return;

      if (document.hidden) {
        await this.active();
      }
    });
  }
}
