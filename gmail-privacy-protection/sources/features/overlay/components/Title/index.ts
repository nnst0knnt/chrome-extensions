import enabled from '@/assets/enabled-symbols/symbol.svg';
import { TitleSection } from '@/definitions';
import { Component } from '@/utilities';

export class Title extends Component {
  static build(section: TitleSection) {
    const GppTitleWrapper = document.createElement('div');
    GppTitleWrapper.className = 'gpp-title-wrapper';

    const GppSymbol = document.createElement('div');
    GppSymbol.className = 'gpp-symbol';
    GppSymbol.innerHTML = enabled;

    const GppMessageWrapper = document.createElement('div');
    GppMessageWrapper.className = 'gpp-message-wrapper';

    const GppPrimaryMessage = document.createElement('div');
    GppPrimaryMessage.className = 'gpp-primary-message';
    GppPrimaryMessage.textContent = section.primary;

    const GppSecondaryMessage = document.createElement('div');
    GppSecondaryMessage.className = 'gpp-secondary-message';
    GppSecondaryMessage.textContent = section.secondary;

    GppTitleWrapper.appendChild(GppSymbol);
    GppMessageWrapper.appendChild(GppPrimaryMessage);
    GppMessageWrapper.appendChild(GppSecondaryMessage);
    GppTitleWrapper.appendChild(GppMessageWrapper);

    return GppTitleWrapper;
  }
}
