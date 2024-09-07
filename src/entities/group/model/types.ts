import { BaseGroup, BaseItem } from "@/entities/base";

export interface Group extends BaseGroup {
  items: BaseItem[];
}
