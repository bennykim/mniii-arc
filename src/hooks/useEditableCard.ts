import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import { useToast } from "@/hooks";
import { Group, Item } from "@/mocks/model";

type EditableItem = Group | Item;
type EditableUIItem = UIGroup | UIItem;
type GroupUpdateHook<T> = () => UseMutationResult<
  EditableItem,
  Error,
  T,
  unknown
>;
type ItemUpdateHook<T> = (
  groupId: string
) => UseMutationResult<EditableItem, Error, T, unknown>;
type GroupDeleteHook = () => UseMutationResult<
  EditableItem,
  Error,
  string,
  unknown
>;
type ItemDeleteHook = (
  groupId: string
) => UseMutationResult<EditableItem, Error, string, unknown>;
type UpdateHook<T extends EditableUIItem> =
  | ItemUpdateHook<T>
  | GroupUpdateHook<T>;
type DeleteHook = GroupDeleteHook | ItemDeleteHook;

export function useEditableCard<T extends EditableUIItem>(
  initialData: T,
  updateHook: UpdateHook<T>,
  deleteHook: DeleteHook,
  groupId?: string
) {
  const { toast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [EditTitle, setEditTitle] = useState(initialData.title);

  const updateItem = groupId
    ? (updateHook as ItemUpdateHook<T>)(groupId)
    : (updateHook as GroupUpdateHook<T>)();
  const deleteItem = groupId
    ? (deleteHook as ItemDeleteHook)(groupId)
    : (deleteHook as GroupDeleteHook)();

  const handleUpdate = async () => {
    try {
      await updateItem.mutateAsync({
        ...initialData,
        title: EditTitle,
      });
      setEditMode(false);
      toast({
        title: "Update Successful",
        description: "Your request has been changed.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { name } = await deleteItem.mutateAsync(initialData.id);
      toast({
        title: "Delete Successful",
        description: `Deleted the ${name} ${groupId ? "item" : "group"}.`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting.",
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
    EditTitle,
    setEditTitle,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    isUpdatePending: updateItem.isPending,
  };
}
