import { MessageUrls } from '@/constants';
import { Message } from '@/definitions';
import { Logger } from '@/utilities';

export class Messenger {
  static async cast(message: Message) {
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

  static async notify(message: Message) {
    try {
      await chrome.runtime.sendMessage(message);

      if (message.logger) {
        Logger[message.logger.level](message.logger.value);
      }
    } catch (e) {
      Logger.error((e as Error).message);
    }
  }

  static listen(handler: (message: Message) => Promise<void> | void) {
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
