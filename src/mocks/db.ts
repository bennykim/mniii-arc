import { DBSchema, IDBPDatabase, openDB } from "idb";

import { KEY_GROUPS } from "@/constants";

import type { Group } from "@/mocks/model";

export interface GROUPS_DB extends DBSchema {
  [KEY_GROUPS]: {
    key: string;
    value: Group;
  };
}

export let db: IDBPDatabase<GROUPS_DB>;

export const initDB = async () => {
  db = await openDB<GROUPS_DB>("GROUPS_DB", 1, {
    upgrade(db) {
      db.createObjectStore(KEY_GROUPS, {
        keyPath: "id",
      });
    },
  });
};
