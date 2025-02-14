import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { PrimaryButton, SecondaryButton, Toast } from '@/components';
import { ModeKinds } from '@/constants';
import { Storage } from '@/utilities';

import { Overlay } from '../..';
import { Password, Title } from '../../components';
import { Rules, TitleSections } from '../../constants';
import { ProtectPrivacy } from '../ProtectPrivacy';

import { ChangePassword } from '.';

describe('ChangePassword', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(Overlay, 'replace').mockImplementation(async (node) => {
      document.documentElement.replaceChildren(node);
    });
    vi.spyOn(Title, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(Password, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(PrimaryButton, 'build').mockReturnValue(document.createElement('button'));
    vi.spyOn(SecondaryButton, 'build').mockReturnValue(document.createElement('button'));
    vi.spyOn(ProtectPrivacy, 'render').mockResolvedValue();
    vi.spyOn(Toast, 'error').mockImplementation(() => {});
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: 'exists-password',
    });
    vi.spyOn(Storage, 'save').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('パスワード変更画面を表示すること', async () => {
    await ChangePassword.render();

    expect(Title.build).toHaveBeenCalledWith(TitleSections.ChangePassword);
    expect(Password.build).toHaveBeenCalledWith({
      id: 'new-password',
      placeholder: '新しいパスワード',
      autocomplete: 'new-password',
    });
    expect(PrimaryButton.build).toHaveBeenCalledWith({
      id: 'change-password',
      label: '変更する',
    });
    expect(SecondaryButton.build).toHaveBeenCalledWith({
      id: 'cancel',
      label: 'キャンセル',
      handler: expect.any(Function),
    });
    expect(Overlay.replace).toHaveBeenCalled();
    expect(document.querySelector('.gpp-container')).not.toBeNull();
    expect(document.querySelector('.gpp-form')).not.toBeNull();
    expect(document.querySelector('.gpp-actions')).not.toBeNull();
  });

  it('キャンセルボタンがクリックされた場合、プライバシー保護画面を表示すること', async () => {
    const button = document.createElement('button');
    button.id = 'cancel';
    vi.spyOn(SecondaryButton, 'build').mockImplementation(({ handler }) => {
      handler && button.addEventListener('click', handler);

      return button;
    });

    await ChangePassword.render();
    button.click();

    await vi.waitFor(async () => {
      expect(ProtectPrivacy.render).toHaveBeenCalledTimes(1);
    });
  });

  it('入力要素が見つからない場合、パスワードを変更できないこと', async () => {
    vi.spyOn(Password, 'build').mockReturnValue(document.createElement('div'));
    await ChangePassword.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(async () => {
      expect(Storage.save).not.toHaveBeenCalled();
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
    });
  });

  it('ストレージにパスワードが設定されていない場合、パスワードを変更できないこと', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: '',
    });
    await ChangePassword.render();

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
    await ChangePassword.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(async () => {
      expect(Toast.error).toHaveBeenCalledWith(Rules.PasswordTooShort.message);
      expect(Storage.save).not.toHaveBeenCalled();
      expect(ProtectPrivacy.render).not.toHaveBeenCalled();
    });
  });

  it('新しいパスワードが設定された場合、ストレージを更新した上でパスワード保護画面を表示すること', async () => {
    const input = document.createElement('input');
    input.value = 'changed-password';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    vi.spyOn(Password, 'build').mockReturnValue(wrapper);
    await ChangePassword.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(async () => {
      expect(Toast.error).not.toHaveBeenCalled();
      expect(Storage.save).toHaveBeenCalledWith({ mode: { value: 'changed-password' } });
      expect(ProtectPrivacy.render).toHaveBeenCalled();
    });
  });
});
