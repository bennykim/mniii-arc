import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/api";
import { KEY_GROUP, KEY_GROUPS } from "@/constants";
import { toUIGroup, toUIGroups } from "@/lib/utils";

import type { Group } from "@/mocks/model";

export const useGroups = () => {
  const query = useQuery<Group[], Error, UIGroups>({
    queryKey: [KEY_GROUPS],
    queryFn: apiService.getAllGroups,
    select: toUIGroups,
  });

  return query;
};

export const useGroup = (id: string) => {
  const query = useQuery<Group, Error, UIGroup>({
    queryKey: [KEY_GROUP, id],
    queryFn: () => apiService.getGroupById(id),
    enabled: !!id,
    select: toUIGroup,
  });

  return query;
};
