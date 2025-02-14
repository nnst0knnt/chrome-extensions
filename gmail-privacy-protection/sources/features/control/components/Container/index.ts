import { Component } from '@/utilities';

export class Container extends Component {
  static build() {
    const GppControlContainer = document.createElement('div');
    GppControlContainer.className = 'gpp-control-container';

    return GppControlContainer;
  }
}
