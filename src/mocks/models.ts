import { DBSchema } from "idb";

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
  groups: {
    key: string;
    value: Group;
  };
}
