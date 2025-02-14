import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import { LoggingKinds } from '@/constants';

import { Logger } from './logger';
import { Storage } from './storage';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('infoレベルのログを出力できること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.All);

    await Logger.info('テスト情報メッセージ');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('テスト情報メッセージ'),
      expect.any(String)
    );
  });

  it('errorレベルのログを出力できること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.All);

    await Logger.error('テストエラーメッセージ');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('テストエラーメッセージ'),
      expect.any(String)
    );
  });

  it('warningレベルのログを出力できること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.All);

    await Logger.warning('テスト警告メッセージ');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('テスト警告メッセージ'),
      expect.any(String)
    );
  });

  it('successレベルのログを出力できること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.All);

    await Logger.success('テスト成功メッセージ');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('テスト成功メッセージ'),
      expect.any(String)
    );
  });

  it('ロギングがなしの場合、ログを出力しないこと', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.None);

    await Promise.all([
      Logger.info('テスト情報メッセージ'),
      Logger.error('テストエラーメッセージ'),
      Logger.warning('テスト警告メッセージ'),
      Logger.success('テスト成功メッセージ'),
    ]);

    expect(console.info).not.toHaveBeenCalled();
  });

  it('ロギングがすべての場合、ログを出力すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.All);

    await Promise.all([
      Logger.info('テスト情報メッセージ'),
      Logger.error('テストエラーメッセージ'),
      Logger.warning('テスト警告メッセージ'),
      Logger.success('テスト成功メッセージ'),
    ]);

    expect(console.info).toHaveBeenCalledTimes(4);
  });

  it('ロギングがエラーの場合、エラーレベルのログのみ出力すること', async () => {
    vi.spyOn(Storage, 'getOne').mockResolvedValue(LoggingKinds.Error);

    await Promise.all([
      Logger.info('テスト情報メッセージ'),
      Logger.error('テストエラーメッセージ'),
      Logger.warning('テスト警告メッセージ'),
      Logger.success('テスト成功メッセージ'),
    ]);

    expect(console.info).toHaveBeenCalledTimes(1);
  });
});
