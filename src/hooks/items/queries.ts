import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/shared/api/base";
import { KEY_ITEM, KEY_ITEMS } from "@/shared/config/constants";
import { toUIItem, toUIItems } from "@/shared/lib/utils";

import type { Item } from "@/entities/item/model/types";

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
