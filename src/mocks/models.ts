import { DBSchema } from "idb";

import { KEY_GROUPS } from "../constants";

export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  items: Item[];
}

export interface GROUPS_DB extends DBSchema {
  [KEY_GROUPS]: {
    key: string;
    value: Group;
  };
}
