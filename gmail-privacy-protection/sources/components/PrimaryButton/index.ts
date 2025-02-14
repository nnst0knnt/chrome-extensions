import { Component } from '@/utilities';

export class PrimaryButton extends Component {
  static build({
    id,
    label,
    type = 'submit',
    handler,
  }: {
    id: string;
    label: string;
    type?: HTMLButtonElement['type'];
    handler?: (e: MouseEvent) => Promise<void> | void;
  }) {
    const GppButton = document.createElement('button');
    GppButton.className = 'gpp-button';
    GppButton.id = id;
    GppButton.type = type;
    GppButton.textContent = label;

    handler && GppButton.addEventListener('click', handler);

    return GppButton;
  }
}
