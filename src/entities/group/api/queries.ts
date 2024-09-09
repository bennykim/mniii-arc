import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/entities/group/api/base";
import { KEY_GROUP, KEY_GROUPS } from "@/shared/config/constants";
import { toUIGroup, toUIGroups } from "@/shared/lib/utils";

import type { Group } from "@/entities/group/model/types";

export const useGetGroupsQuery = () => {
  const query = useQuery<Group[], Error, UIGroups>({
    queryKey: [KEY_GROUPS],
    queryFn: apiService.getAllGroups,
    select: toUIGroups,
  });

  return query;
};

export const useGetGroupQuery = (id: string) => {
  const query = useQuery<Group, Error, UIGroup>({
    queryKey: [KEY_GROUP, id],
    queryFn: () => apiService.getGroupById(id),
    enabled: !!id,
    select: toUIGroup,
  });

  return query;
};
