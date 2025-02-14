import { Themes } from '@/constants';
import { EntryComponent } from '@/definitions';
import { Storage } from '@/utilities';

import { Home } from './pages';

export class Control extends EntryComponent {
  static async start() {
    const theme = await Storage.getOne('theme');

    const GppControl = document.createElement('div');
    GppControl.className = `gpp-control ${theme === Themes.Dark ? 'dark-mode' : 'light-mode'}`;

    document.documentElement.appendChild(GppControl);

    this._element = GppControl;

    await Home.render();
  }
}
