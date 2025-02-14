import { ThemeToggle } from '@/components';
import { PageComponent } from '@/utilities';

import { Control } from '../..';
import {
  Container,
  Divider,
  LoggingOptions,
  ModeOptions,
  ReactivateOptions,
  StateToggle,
  Title,
} from '../../components';

export class Home extends PageComponent {
  static async render() {
    const PageContainer = Container.build();

    const GppControlWrapper = document.createElement('div');
    GppControlWrapper.className = 'gpp-control-wrapper';

    const GppControlBottomWrapper = document.createElement('div');
    GppControlBottomWrapper.className = 'gpp-control-bottom-wrapper';

    GppControlWrapper.appendChild(await ModeOptions.build());
    GppControlWrapper.appendChild(Divider.build());
    GppControlWrapper.appendChild(await ReactivateOptions.build());
    GppControlWrapper.appendChild(Divider.build());
    GppControlWrapper.appendChild(await LoggingOptions.build());
    PageContainer.appendChild(Title.build());
    PageContainer.appendChild(GppControlWrapper);
    GppControlBottomWrapper.appendChild(await ThemeToggle.build());
    GppControlBottomWrapper.appendChild(await StateToggle.build());
    PageContainer.appendChild(GppControlBottomWrapper);

    Control.replace(PageContainer);
  }
}
