import { Component } from '@/utilities';

export class SecondaryButton extends Component {
  static build({
    id,
    label,
    handler,
  }: {
    id: string;
    label: string;
    handler?: (e: MouseEvent) => Promise<void> | void;
  }) {
    const GppSecondaryButton = document.createElement('button');
    GppSecondaryButton.className = 'gpp-button secondary';
    GppSecondaryButton.id = id;
    GppSecondaryButton.textContent = label;

    handler && GppSecondaryButton.addEventListener('click', handler);

    return GppSecondaryButton;
  }
}
