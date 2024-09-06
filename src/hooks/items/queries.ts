import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/api";
import { KEY_ITEM, KEY_ITEMS } from "@/constants";
import { toUIItem, toUIItems } from "@/lib/utils";

import type { Item } from "@/mocks/model";

export const useGetItems = (groupId: string) => {
  const query = useQuery<Item[], Error, UIItems>({
    queryKey: [KEY_ITEMS, groupId],
    queryFn: () => apiService.getAllItems(groupId),
    enabled: !!groupId,
    select: toUIItems,
  });

  return query;
};

export const useGetItem = (groupId: string, itemId: string) => {
  const query = useQuery<Item, Error, UIItem>({
    queryKey: [KEY_ITEM, groupId, itemId],
    queryFn: () => apiService.getItemById(groupId, itemId),
    enabled: !!groupId && !!itemId,
    select: toUIItem,
  });

  return query;
};
