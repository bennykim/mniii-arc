import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Group } from "@/entities/group/model/types";
import type { Item } from "@/entities/item/model/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toUIItem = (item: Item): UIItem => ({
  id: item.id,
  title: item.name,
});

export const toUIGroup = (group: Group): UIGroup => ({
  id: group.id,
  title: group.name,
  list: group.items.map(toUIItem),
});

export const toUIGroups = (groups: Group[]): UIGroups => groups.map(toUIGroup);

export const toUIItems = (items: Item[]): UIItems => ({
  list: items.map(toUIItem),
});

export const toServerItem = (item: UIItem): Item => ({
  id: item.id,
  name: item.title,
});

export const toServerGroup = (group: UIGroup): Group => ({
  id: group.id,
  name: group.title,
  items: group.list.map(toServerItem),
});

export const toServerGroupExceptId = (
  group: Omit<UIGroup, "id">
): Omit<Group, "id"> => ({
  name: group.title,
  items: group.list.map(toServerItem),
});

export const toServerItemExceptId = (
  group: Omit<UIItem, "id">
): Omit<Item, "id"> => ({
  name: group.title,
});
