import { merge } from 'lodash';
import { PartialDeep } from 'type-fest';

import {
  ModeKinds,
  ReactivateInactives,
  ReactivateKinds,
  ReactivateTimers,
  Themes,
} from '@/constants';
import { StorageKey, StorageValues } from '@/definitions';

export class Storage {
  static async getOne<Key extends keyof StorageValues>(key: Key) {
    try {
      return ((await chrome.storage.sync.get({ [key]: this.defaults()[key] })) as StorageValues)[
        key
      ] as StorageValues[typeof key];
    } catch (_e) {
      return this.defaults()[key];
    }
  }

  static async get(...keys: StorageKey[]) {
    try {
      const values = (await chrome.storage.sync.get(this.defaults())) as StorageValues;

      if (!keys.length) return values;

      return keys.reduce(
        (previous, key) => ({ ...previous, [key]: values[key] }),
        {} as StorageValues
      );
    } catch (_e) {
      return this.defaults();
    }
  }

  static async save(value: PartialDeep<StorageValues>) {
    try {
      const current = await this.get();

      await chrome.storage.sync.set(merge(current, value));
    } catch (e) {
      console.error(e);
    }
  }

  private static defaults(): StorageValues {
    return {
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? Themes.Dark : Themes.Light,
      enabled: true,
      mode: {
        kind: ModeKinds.Click,
        value: null,
      },
      reactivate: {
        enabled: true,
        kind: ReactivateKinds.Inactive,
        inactive: ReactivateInactives.On,
        timer: ReactivateTimers.Minutes5,
      },
    };
  }
}
