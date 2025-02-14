export class Toast {
  static error(message: string, duration = 3000) {
    const GppToast = document.createElement('div');
    GppToast.className = 'gpp-toast';
    GppToast.textContent = message;
    document.body.appendChild(GppToast);

    setTimeout(() => {
      GppToast.remove();
    }, duration);
  }
}
