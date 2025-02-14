import enabled from '@/assets/enabled-symbols/symbol.svg';
import { Component } from '@/utilities';

export class Title extends Component {
  static build() {
    const GppControlTitleWrapper = document.createElement('div');
    GppControlTitleWrapper.className = 'gpp-control-title-wrapper';

    const GppControlSymbol = document.createElement('div');
    GppControlSymbol.className = 'gpp-control-symbol';
    GppControlSymbol.innerHTML = enabled;

    const GppControlTitle = document.createElement('div');
    GppControlTitle.className = 'gpp-control-title';
    GppControlTitle.textContent = 'Gmail Privacy Protection';

    const GppControlSubtitle = document.createElement('div');
    GppControlSubtitle.className = 'gpp-control-subtitle';
    GppControlSubtitle.textContent = '拡張機能の設定を変更できます';

    GppControlTitleWrapper.appendChild(GppControlSymbol);
    GppControlTitleWrapper.appendChild(GppControlTitle);
    GppControlTitleWrapper.appendChild(GppControlSubtitle);

    return GppControlTitleWrapper;
  }
}
