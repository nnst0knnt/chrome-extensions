import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import { LogLevels, MessageKinds, MessageUrls } from '@/constants';
import { Logger } from '@/utilities';

import { Messenger } from './messenger';

describe('Messenger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Logger, 'error').mockImplementation(async () => {});
    vi.spyOn(Logger, 'info').mockImplementation(async () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('cast', () => {
    it('タブにメッセージを送信できること', async () => {
      (vi.spyOn(chrome.tabs, 'query') as ReturnType<typeof vi.spyOn>).mockResolvedValue([
        { id: 123 } as chrome.tabs.Tab,
      ]);
      vi.spyOn(chrome.tabs, 'sendMessage').mockResolvedValue(void 0);

      await Messenger.cast({
        kind: MessageKinds.State,
        value: true,
        logger: {
          level: LogLevels.Info,
          value: 'テストメッセージ',
        },
      });

      expect(chrome.tabs.query).toHaveBeenCalledWith({
        url: expect.stringContaining(MessageUrls.Gmail),
      });
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          kind: MessageKinds.State,
          value: true,
        })
      );
      expect(Logger.info).toHaveBeenCalledWith('テストメッセージ');
    });

    it('タブが存在しない場合、送信処理をスキップすること', async () => {
      (vi.spyOn(chrome.tabs, 'query') as ReturnType<typeof vi.spyOn>).mockResolvedValue([]);
      vi.spyOn(chrome.tabs, 'sendMessage').mockResolvedValue(void 0);

      await Messenger.cast({ kind: MessageKinds.State, value: true });

      expect(chrome.tabs.query).toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('タブIDが存在しない場合、送信処理をスキップすること', async () => {
      (vi.spyOn(chrome.tabs, 'query') as ReturnType<typeof vi.spyOn>).mockResolvedValue([
        {} as chrome.tabs.Tab,
      ]);
      vi.spyOn(chrome.tabs, 'sendMessage').mockResolvedValue(void 0);

      await Messenger.cast({ kind: MessageKinds.State, value: true });

      expect(chrome.tabs.query).toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('sendMessage中にエラーが発生した場合、ログに記録すること', async () => {
      (vi.spyOn(chrome.tabs, 'query') as ReturnType<typeof vi.spyOn>).mockResolvedValue([
        { id: 123 } as chrome.tabs.Tab,
      ]);
      vi.spyOn(chrome.tabs, 'sendMessage').mockRejectedValue(new Error('送信エラー'));

      await Messenger.cast({ kind: MessageKinds.State, value: true });

      expect(Logger.error).toHaveBeenCalledWith('送信エラー');
    });

    it('query中にエラーが発生した場合、ログに記録すること', async () => {
      vi.spyOn(chrome.tabs, 'query').mockRejectedValue(new Error('クエリエラー'));

      await Messenger.cast({ kind: MessageKinds.State, value: true });

      expect(Logger.error).toHaveBeenCalledWith('クエリエラー');
    });

    it('複数のタブにメッセージを送信できること', async () => {
      (vi.spyOn(chrome.tabs, 'query') as ReturnType<typeof vi.spyOn>).mockResolvedValue([
        { id: 123 },
        { id: 456 },
      ] as chrome.tabs.Tab[]);
      vi.spyOn(chrome.tabs, 'sendMessage').mockResolvedValue(void 0);

      await Messenger.cast({ kind: MessageKinds.State, value: true });

      expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.tabs.sendMessage).toHaveBeenNthCalledWith(1, 123, expect.anything());
      expect(chrome.tabs.sendMessage).toHaveBeenNthCalledWith(2, 456, expect.anything());
    });
  });

  describe('notify', () => {
    it('ランタイムメッセージを送信できること', async () => {
      vi.spyOn(chrome.runtime, 'sendMessage').mockResolvedValue(void 0);

      await Messenger.notify({
        kind: MessageKinds.State,
        value: true,
        logger: {
          level: LogLevels.Info,
          value: 'テスト通知',
        },
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalled();
      expect(Logger.info).toHaveBeenCalledWith('テスト通知');
    });

    it('sendMessage中にエラーが発生した場合、ログに記録すること', async () => {
      vi.spyOn(chrome.runtime, 'sendMessage').mockRejectedValue(new Error('通知エラー'));

      await Messenger.notify({ kind: MessageKinds.State, value: true });

      expect(Logger.error).toHaveBeenCalledWith('通知エラー');
    });
  });

  describe('listen', () => {
    let cast: Function;
    let send: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      vi.spyOn(chrome.runtime.onMessage, 'addListener').mockImplementation((fn) => {
        cast = fn;
      });
      send = vi.fn();
    });

    it('メッセージリスナーを登録できること', () => {
      Messenger.listen(async () => {});

      expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });

    it('ハンドラが正常に実行された場合、成功レスポンスを返すこと', async () => {
      Messenger.listen(async () => {});

      await cast({ kind: MessageKinds.State }, {}, send);

      expect(send).toHaveBeenCalledWith({ success: true });
    });

    it('ハンドラ実行中にエラーが発生した場合、エラーレスポンスを返すこと', async () => {
      Messenger.listen(async () => {
        throw new Error('ハンドラエラー');
      });

      await cast({ kind: MessageKinds.State }, {}, send);

      expect(Logger.error).toHaveBeenCalledWith('ハンドラエラー');
      expect(send).toHaveBeenCalledWith({ success: false, message: 'ハンドラエラー' });
    });

    it('loggerプロパティがあればログに記録すること', async () => {
      Messenger.listen(async () => {});

      await cast(
        {
          kind: MessageKinds.State,
          logger: { level: LogLevels.Info, value: 'テストメッセージ' },
        },
        {},
        send
      );

      expect(Logger.info).toHaveBeenCalledWith('テストメッセージ');
    });
  });
});
