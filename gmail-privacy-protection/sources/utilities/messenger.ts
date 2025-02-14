import { MessageUrls } from '@/constants';
import { Message } from '@/definitions';
import { Logger } from '@/utilities';

export class Messenger {
  /**
   * タブにメッセージを送信する
   *
   * バックグラウンドスクリプトやポップアップから呼び出されることを想定している
   */
  static async cast(message: Message) {
    if (!chrome?.tabs?.query || !chrome?.tabs?.sendMessage) return;

    try {
      const tabs = await chrome.tabs.query({
        url: MessageUrls.Gmail,
      });

      const handler = async (tab: chrome.tabs.Tab) => {
        if (!tab.id) return;

        try {
          await chrome.tabs.sendMessage(tab.id, message);
        } catch (e: unknown) {
          Logger.error((e as Error).message);
        }
      };

      if (tabs.length) {
        await Promise.all(tabs.map(handler));
      }

      if (message.logger) {
        Logger[message.logger.level](message.logger.value);
      }
    } catch (e) {
      Logger.error((e as Error).message);
    }
  }

  /**
   * バックグラウンドスクリプトにメッセージを送信する
   *
   * コンテンツスクリプトやポップアップから呼び出されることを想定している
   */
  static async notify(message: Message) {
    if (!chrome?.runtime?.sendMessage) return;

    try {
      await chrome.runtime.sendMessage(message);

      if (message.logger) {
        Logger[message.logger.level](message.logger.value);
      }
    } catch (e) {
      Logger.error((e as Error).message);
    }
  }

  /**
   * メッセージリスナーを設定する
   *
   * バックグラウンドスクリプトやコンテンツスクリプト、ポップアップのいずれも、初期化時に一度だけ呼び出されることを想定している
   */
  static listen(handler: (message: Message) => Promise<void> | void) {
    if (!chrome?.runtime?.onMessage) return;

    chrome.runtime.onMessage.addListener(async (message: Message, _sender, send) => {
      try {
        await handler(message);

        if (message.logger) {
          Logger[message.logger.level](message.logger.value);
        }

        send({ success: true });
      } catch (e) {
        Logger.error((e as Error).message);

        send({ success: false, message: (e as Error).message });
      }
    });
  }
}
