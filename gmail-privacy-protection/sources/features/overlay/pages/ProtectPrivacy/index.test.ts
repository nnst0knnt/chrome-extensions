import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { PrimaryButton, SecondaryButton, Toast } from '@/components';
import { ModeKinds } from '@/constants';
import { Storage } from '@/utilities';

import { Overlay } from '../..';
import { Password, Title } from '../../components';
import { Rules, TitleSections } from '../../constants';
import { ChangePassword } from '../ChangePassword';

import { ProtectPrivacy } from '.';

describe('ProtectPrivacy', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(Overlay, 'replace').mockImplementation(async (node) => {
      document.documentElement.replaceChildren(node);
    });
    vi.spyOn(Overlay, 'close').mockResolvedValue();
    vi.spyOn(Title, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(PrimaryButton, 'build').mockReturnValue(document.createElement('button'));
    vi.spyOn(SecondaryButton, 'build').mockReturnValue(document.createElement('button'));
    vi.spyOn(Password, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(ChangePassword, 'render').mockResolvedValue();
    vi.spyOn(Toast, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('解除方法がクリックの場合、簡易なプライバシー保護画面を表示すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Click,
      value: null,
    });

    await ProtectPrivacy.render();

    expect(Title.build).toHaveBeenCalledWith(TitleSections.ProtectPrivacy);
    expect(PrimaryButton.build).toHaveBeenCalledWith({
      id: 'clear-overlay',
      label: '閉じる',
      handler: expect.any(Function),
    });
    expect(Overlay.replace).toHaveBeenCalled();
    expect(document.querySelector('.gpp-container.height-auto')).not.toBeNull();
  });

  it('閉じるボタンをクリックすると、オーバーレイが閉じること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Click,
      value: null,
    });
    const button = document.createElement('button');
    vi.spyOn(PrimaryButton, 'build').mockImplementation(({ handler }) => {
      handler && button.addEventListener('click', handler);

      return button;
    });

    await ProtectPrivacy.render();
    button.click();

    await vi.waitFor(() => {
      expect(Overlay.close).toHaveBeenCalledTimes(1);
    });
  });

  it('解除方法がパスワードの場合、プライバシー保護画面を表示すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: 'correct-password',
    });

    await ProtectPrivacy.render();

    expect(Title.build).toHaveBeenCalledWith(TitleSections.ProtectPrivacy);
    expect(Password.build).toHaveBeenCalledWith({
      id: 'input-password',
      placeholder: 'パスワード',
      autocomplete: 'current-password',
    });
    expect(PrimaryButton.build).toHaveBeenCalledWith({
      id: 'clear-overlay',
      label: '閉じる',
    });
    expect(SecondaryButton.build).toHaveBeenCalledWith({
      id: 'change-password',
      label: 'パスワードを変更',
      handler: expect.any(Function),
    });
    expect(Overlay.replace).toHaveBeenCalled();
    expect(document.querySelector('.gpp-container')).not.toBeNull();
    expect(document.querySelector('.gpp-form')).not.toBeNull();
    expect(document.querySelector('.gpp-actions')).not.toBeNull();
  });

  it('正しいパスワードを入力した場合、オーバーレイが閉じること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: 'password123',
    });
    const input = document.createElement('input');
    input.value = 'password123';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    vi.spyOn(Password, 'build').mockReturnValue(wrapper);
    await ProtectPrivacy.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(() => {
      expect(Overlay.close).toHaveBeenCalledTimes(1);
      expect(Toast.error).not.toHaveBeenCalled();
    });
  });

  it('誤ったパスワードを入力した場合、エラーメッセージを表示すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: 'password123',
    });
    const input = document.createElement('input');
    input.value = 'wrong-password';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    vi.spyOn(Password, 'build').mockReturnValue(wrapper);
    await ProtectPrivacy.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(() => {
      expect(Toast.error).toHaveBeenCalledWith(Rules.PasswordInvalid.message);
      expect(Overlay.close).not.toHaveBeenCalled();
    });
  });

  it('入力欄が存在しない場合、オーバーレイを閉じないこと', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: 'password123',
    });
    vi.spyOn(Password, 'build').mockReturnValue(document.createElement('div'));
    await ProtectPrivacy.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(() => {
      expect(Overlay.close).not.toHaveBeenCalled();
    });
  });

  it('ストレージにパスワードが設定されていない場合、オーバーレイを閉じないこと', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: '',
    });
    const input = document.createElement('input');
    input.value = 'some-password';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    vi.spyOn(Password, 'build').mockReturnValue(wrapper);
    await ProtectPrivacy.render();

    (document.querySelector('.gpp-form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    await vi.waitFor(() => {
      expect(Overlay.close).not.toHaveBeenCalled();
    });
  });

  it('パスワード変更ボタンがクリックされた場合、パスワード変更画面を表示すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue({
      kind: ModeKinds.Password,
      value: 'password123',
    });
    const button = document.createElement('button');
    vi.spyOn(SecondaryButton, 'build').mockImplementation(({ handler }) => {
      handler && button.addEventListener('click', handler);

      return button;
    });

    await ProtectPrivacy.render();
    button.click();

    await vi.waitFor(() => {
      expect(ChangePassword.render).toHaveBeenCalledTimes(1);
    });
  });
});
