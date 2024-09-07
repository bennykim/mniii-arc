import { useQuery } from "@tanstack/react-query";

import { apiService } from "@/shared/api/base";
import { KEY_GROUP, KEY_GROUPS } from "@/shared/config/constants";
import { toUIGroup, toUIGroups } from "@/shared/lib/utils";

import type { Group } from "@/mocks/model";

export const useGetGroups = () => {
  const query = useQuery<Group[], Error, UIGroups>({
    queryKey: [KEY_GROUPS],
    queryFn: apiService.getAllGroups,
    select: toUIGroups,
  });

  return query;
};

export const useGetGroup = (id: string) => {
  const query = useQuery<Group, Error, UIGroup>({
    queryKey: [KEY_GROUP, id],
    queryFn: () => apiService.getGroupById(id),
    enabled: !!id,
    select: toUIGroup,
  });

  return query;
};
