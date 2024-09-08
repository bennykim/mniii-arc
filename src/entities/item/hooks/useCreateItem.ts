import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import type { Item } from "@/entities/item/model/types";

type ItemCreateHook = (
  groupId: string
) => UseMutationResult<Item, Error, Omit<UIItem, "id">, unknown>;
type useCreateItemProps = { mutationHook: ItemCreateHook; groupId: string };

export function useCreateItem({ mutationHook, groupId }: useCreateItemProps) {
  const [newTitle, setNewTitle] = useState("");
  const create = mutationHook(groupId);

  const handleCreateItem = async () => {
    if (newTitle.trim()) {
      try {
        await create.mutateAsync({
          title: newTitle,
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
    handleCreateItem,
  };
}
