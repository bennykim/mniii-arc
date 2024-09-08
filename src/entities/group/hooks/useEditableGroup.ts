import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";

import type { Group } from "@/entities/group/model/types";

type GroupUpdateHook = () => UseMutationResult<Group, Error, UIGroup, unknown>;
type GroupDeleteHook = () => UseMutationResult<Group, Error, string, unknown>;

export function useEditableGroup(
  initialData: UIGroup,
  updateHook: GroupUpdateHook,
  deleteHook: GroupDeleteHook
) {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData.title);

  const updateGroup = updateHook();
  const deleteGroup = deleteHook();

  const handleUpdate = async () => {
    try {
      await updateGroup.mutateAsync({
        ...initialData,
        title: editTitle,
      });
      setEditMode(false);
      toast({
        title: "Update Successful",
        description: "Your group has been updated.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the group.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { name } = await deleteGroup.mutateAsync(initialData.id);
      toast({
        title: "Delete Successful",
        description: `Deleted the group: ${name}.`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the group.",
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
    isUpdatePending: updateGroup.isPending,
  };
}
