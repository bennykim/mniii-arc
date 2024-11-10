import { DBSchema, IDBPDatabase, openDB } from 'idb';

import type { Group } from '@/entities/group/model/types';
import { KEY_GROUPS } from '@/shared/config/constants';

export interface GROUPS_DB extends DBSchema {
  [KEY_GROUPS]: {
    key: string;
    value: Group;
  };
}

export let db: IDBPDatabase<GROUPS_DB>;

export const initGroupsDB = async () => {
  db = await openDB<GROUPS_DB>('GROUPS_DB', 1, {
    upgrade(db) {
      db.createObjectStore(KEY_GROUPS, {
        keyPath: 'id',
      });
    },
  });
};
