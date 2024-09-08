import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";

import type { Item } from "@/entities/item/model/types";

type ItemUpdateHook = (
  groupId: string
) => UseMutationResult<Item, Error, UIItem, unknown>;
type ItemDeleteHook = (
  groupId: string
) => UseMutationResult<Item, Error, string, unknown>;

export function useEditableItem(
  initialData: UIItem,
  updateHook: ItemUpdateHook,
  deleteHook: ItemDeleteHook,
  groupId: string
) {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData.title);

  const updateItem = updateHook(groupId);
  const deleteItem = deleteHook(groupId);

  const handleUpdate = async () => {
    try {
      await updateItem.mutateAsync({
        ...initialData,
        title: editTitle,
      });
      setEditMode(false);
      toast({
        title: "Update Successful",
        description: "Your item has been updated.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { name } = await deleteItem.mutateAsync(initialData.id);
      toast({
        title: "Delete Successful",
        description: `Deleted the item: ${name}.`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the item.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditTitle(initialData.title);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
    setEditTitle(initialData.title);
  };

  return {
    editMode,
    editTitle,
    setEditTitle,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    isUpdatePending: updateItem.isPending,
  };
}
