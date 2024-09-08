import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import type { Group } from "@/entities/group/model/types";

type GroupCreateHook = () => UseMutationResult<
  Group,
  Error,
  Omit<UIGroup, "id">,
  unknown
>;
type useCreateGroupProps = { mutationHook: GroupCreateHook };

export function useCreateGroup({ mutationHook }: useCreateGroupProps) {
  const [newTitle, setNewTitle] = useState("");
  const create = mutationHook();

  const handleCreateGroup = async () => {
    if (newTitle.trim()) {
      try {
        await create.mutateAsync({
          title: newTitle,
          list: [],
        });
        setNewTitle("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    isCreatePending: create.isPending,
    newTitle,
    setNewTitle,
    handleCreateGroup,
  };
}
