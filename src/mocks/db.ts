import { IDBPDatabase, openDB } from "idb";

import { GROUPS_DB } from "./model";

export const KEY_GROUPS = "groups";

export let db: IDBPDatabase<GROUPS_DB>;

export const initDB = async () => {
  db = await openDB<GROUPS_DB>("GROUPS_DB", 1, {
    upgrade(db) {
      db.createObjectStore(KEY_GROUPS, { keyPath: "id" });
    },
  });
};
