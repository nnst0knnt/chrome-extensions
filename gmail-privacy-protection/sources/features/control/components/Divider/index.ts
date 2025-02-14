import { Component } from '@/utilities';

export class Divider extends Component {
  static build() {
    const GppControlDivider = document.createElement('div');
    GppControlDivider.className = 'gpp-control-divider';

    return GppControlDivider;
  }
}
