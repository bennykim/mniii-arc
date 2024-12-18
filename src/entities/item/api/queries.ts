import { useQuery } from '@tanstack/react-query';

import { apiService } from '@/entities/item/api/base';
import type { Item } from '@/entities/item/model/types';
import { KEY_ITEM, KEY_ITEMS } from '@/shared/config/constants';
import { toUIItem, toUIItems } from '@/shared/lib/transform';

export const useGetItemsQuery = (groupId: string) => {
  const query = useQuery<Item[], Error, UIItems>({
    queryKey: [KEY_ITEMS, groupId],
    queryFn: () => apiService.getAllItems(groupId),
    enabled: !!groupId,
    select: toUIItems,
  });

  return query;
};

export const useGetItemQuery = (groupId: string, itemId: string) => {
  const query = useQuery<Item, Error, UIItem>({
    queryKey: [KEY_ITEM, groupId, itemId],
    queryFn: () => apiService.getItemById(groupId, itemId),
    enabled: !!groupId && !!itemId,
    select: toUIItem,
  });

  return query;
};
