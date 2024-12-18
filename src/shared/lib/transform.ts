import type { Group } from '@/entities/group/model/types';
import type { History } from '@/entities/history/model/types';
import type { Item } from '@/entities/item/model/types';

export const toUIItem = (item: Item): UIItem => ({
  id: item.id,
  title: item.name,
  createdAt: item.createdAt,
});

export const toUIGroup = (group: Group): UIGroup => ({
  id: group.id,
  title: group.name,
  list: group.items.map(toUIItem),
  createdAt: group.createdAt,
});

export const toUIGroups = (groups: Group[]): UIGroups => groups.map(toUIGroup);

export const toUIItems = (items: Item[]): UIItems => ({
  list: items.map(toUIItem),
});

export const toServerItem = (item: UIItem): Item => ({
  id: item.id,
  name: item.title,
  createdAt: item.createdAt,
});

export const toServerGroup = (group: UIGroup): Group => ({
  id: group.id,
  name: group.title,
  items: group.list.map(toServerItem),
  createdAt: group.createdAt,
});

export const toServerGroupExceptId = (
  group: Omit<UIGroup, 'id' | 'createdAt'>,
): Omit<Group, 'id' | 'createdAt'> => ({
  name: group.title,
  items: group.list.map(toServerItem),
});

export const toServerItemExceptId = (
  group: Omit<UIItem, 'id' | 'createdAt'>,
): Omit<Item, 'id' | 'createdAt'> => ({
  name: group.title,
});

export const toUIHistory = (history: History[]): UIHistories => {
  return history.map((item) => ({
    id: item.id,
    title: item.name,
    content: item.description,
    createdAt: item.createdAt,
    isRead: false,
  }));
};
