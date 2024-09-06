import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import { Group, Item } from "@/mocks/model";

type GroupCreateHook = () => UseMutationResult<
  Group,
  Error,
  Omit<UIGroup, "id">,
  unknown
>;
type ItemCreateHook = (
  groupId: string
) => UseMutationResult<Item, Error, Omit<UIItem, "id">, unknown>;
type CreateHook<T extends UIGroup | UIItem> = T extends UIGroup
  ? GroupCreateHook
  : ItemCreateHook;

export const useCreateEntry = <T extends UIGroup | UIItem>({
  mutationHook,
  groupId,
}: {
  mutationHook: CreateHook<T>;
  groupId?: string;
}) => {
  const [newTitle, setNewTitle] = useState("");

  const create = groupId
    ? (mutationHook as ItemCreateHook)(groupId)
    : (mutationHook as GroupCreateHook)();

  const handleCreateItem = async () => {
    if (newTitle.trim()) {
      try {
        if (groupId) {
          await (create as ReturnType<ItemCreateHook>).mutateAsync({
            title: newTitle,
          });
        } else {
          await (create as ReturnType<GroupCreateHook>).mutateAsync({
            title: newTitle,
            list: [],
          });
        }
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
};
