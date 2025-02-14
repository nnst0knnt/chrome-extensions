import dark from '@/assets/themes/dark.svg';
import light from '@/assets/themes/light.svg';
import { LogLevels, MessageKinds, Themes } from '@/constants';
import { NotFoundElement } from '@/exceptions';
import { Component } from '@/utilities';
import { Messenger, Storage } from '@/utilities';

export class ThemeToggle extends Component {
  private static _symbol: HTMLElement | null = null;

  static async build(args: { fixed: boolean } = { fixed: false }) {
    const theme = await Storage.getOne('theme');

    const GppThemeContainer = document.createElement('div');
    GppThemeContainer.id = 'gpp-theme-container';
    GppThemeContainer.className = `gpp-theme-container ${args.fixed ? 'fixed' : ''} ${theme === Themes.Dark ? 'dark-mode' : 'light-mode'}`;

    const GppThemeButton = document.createElement('button');
    GppThemeButton.className = 'gpp-theme-button';
    GppThemeButton.id = 'gpp-theme';
    GppThemeButton.addEventListener('click', () => this.toggle());

    const GppThemeSymbol = document.createElement('span');
    GppThemeSymbol.className = 'gpp-theme-symbol';
    GppThemeSymbol.innerHTML = theme === Themes.Dark ? light : dark;

    GppThemeButton.appendChild(GppThemeSymbol);
    GppThemeContainer.appendChild(GppThemeButton);

    this._element = GppThemeContainer;
    this._symbol = GppThemeSymbol;

    return GppThemeContainer;
  }

  static async rebuild(args: { fixed: boolean } = { fixed: false }) {
    if (!this._element) throw new NotFoundElement();

    this._element.remove();

    this._element = await this.build(args);

    return this._element;
  }

  static async toggle() {
    if (!this._element || !this._symbol) throw new NotFoundElement();

    const theme = await Storage.getOne('theme');

    const newTheme = theme === Themes.Dark ? Themes.Light : Themes.Dark;

    await Storage.save({ theme: newTheme });

    this._symbol.innerHTML = newTheme === Themes.Dark ? light : dark;

    const elements = document.querySelectorAll('.dark-mode, .light-mode');

    elements.forEach((element) => {
      element.classList.toggle('dark-mode');
      element.classList.toggle('light-mode');
    });

    Messenger.cast({
      kind: MessageKinds.Theme,
      value: newTheme,
      logger: {
        level: LogLevels.Info,
        value: `テーマを"${newTheme === Themes.Dark ? 'ダークモード' : 'ライトモード'}"にしました`,
      },
    });
  }
}
