import { ThemeToggle } from '@/components';
import { PageComponent } from '@/definitions';

import { Control } from '../..';
import {
  Container,
  Divider,
  ModeOptions,
  ReactivateOptions,
  StateToggle,
  Title,
} from '../../components';

export class Home extends PageComponent {
  static async render() {
    const PageContainer = Container.build();
    const PageTitle = Title.build();
    const OptionsOfMode = await ModeOptions.build();
    const OptionsOfReactivate = await ReactivateOptions.build();
    const ToggleOfState = await StateToggle.build();
    const ToggleOfTheme = await ThemeToggle.build();

    const GppControlWrapper = document.createElement('div');
    GppControlWrapper.className = 'gpp-control-wrapper';

    const GppControlBottomWrapper = document.createElement('div');
    GppControlBottomWrapper.className = 'gpp-control-bottom-wrapper';

    GppControlWrapper.appendChild(OptionsOfMode);
    GppControlWrapper.appendChild(Divider.build());
    GppControlWrapper.appendChild(OptionsOfReactivate);
    PageContainer.appendChild(PageTitle);
    PageContainer.appendChild(GppControlWrapper);
    GppControlBottomWrapper.appendChild(ToggleOfTheme);
    GppControlBottomWrapper.appendChild(ToggleOfState);
    PageContainer.appendChild(GppControlBottomWrapper);

    Control.replace(PageContainer);
  }
}
