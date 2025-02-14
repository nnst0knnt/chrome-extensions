import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { PrimaryButton, Toast } from '@/components';
import { Storage } from '@/utilities';

import { Overlay } from '../..';
import { Password, Title } from '../../components';
import { Rules, TitleSections } from '../../constants';
import { ProtectPrivacy } from '../ProtectPrivacy';

import { SetupPassword } from '.';

describe('SetupPassword', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(Overlay, 'replace').mockImplementation(async (node) => {
      document.documentElement.replaceChildren(node);
    });
    vi.spyOn(Title, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(Password, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(PrimaryButton, 'build').mockReturnValue(document.createElement('button'));
    vi.spyOn(ProtectPrivacy, 'render').mockResolvedValue();
    vi.spyOn(Toast, 'error').mockImplementation(() => {});
    vi.spyOn(Storage, 'save').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('パスワード設定画面を表示すること', async () => {
    await SetupPassword.render();

    expect(Title.build).toHaveBeenCalledWith(TitleSections.SetupPassword);
    expect(Password.build).toHaveBeenCalledWith({
      id: 'password',
      placeholder: 'パスワード',
      autocomplete: 'new-password',
    });
    expect(PrimaryButton.build).toHaveBeenCalledWith({
      id: 'setup-password',
      label: '設定する',
    });
    expect(Overlay.replace).toHaveBeenCalled();
    expect(document.querySelector('.gpp-container.height-auto')).not.toBeNull();
    expect(document.querySelector('.gpp-form')).not.toBeNull();
  });

  it('入力要素が見つからない場合、パスワードを設定できないこと', async () => {
    vi.spyOn(Password, 'build').mockReturnValue(document.createElement('div'));
    await SetupPassword.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(async () => {
      expect(Storage.save).not.toHaveBeenCalled();
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
    });
  });

  it('パスワードが短すぎる場合、エラーを表示すること', async () => {
    const input = document.createElement('input');
    input.value = 'a';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    vi.spyOn(Password, 'build').mockReturnValue(wrapper);
    await SetupPassword.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(async () => {
      expect(Toast.error).toHaveBeenCalledWith(Rules.PasswordTooShort.message);
      expect(Storage.save).not.toHaveBeenCalled();
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
    });
  });

  it('有効なパスワードを入力した場合、ストレージに保存してプライバシー保護画面に遷移すること', async () => {
    const input = document.createElement('input');
    input.value = 'correct-password';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    vi.spyOn(Password, 'build').mockReturnValue(wrapper);
    await SetupPassword.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(async () => {
      expect(Toast.error).not.toHaveBeenCalled();
      expect(Storage.save).toHaveBeenCalledWith({ mode: { value: 'correct-password' } });
      expect(ProtectPrivacy.render).toHaveBeenCalled();
    });
  });
});
