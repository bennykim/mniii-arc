import { useState } from "react";

import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from "@/entities/group/api";
import { useToast } from "@/shared/hooks/use-toast";

export const useGroupActions = () => {
  const { toast } = useToast();
  const [newGroupTitle, setNewGroupTitle] = useState("");

  const createGroup = useCreateGroupMutation();
  const updateGroup = useUpdateGroupMutation();
  const deleteGroup = useDeleteGroupMutation();

  const handleCreateGroup = async () => {
    if (newGroupTitle.trim()) {
      try {
        await createGroup.mutateAsync({
          title: newGroupTitle,
          list: [],
        });
        setNewGroupTitle("");
        toast({
          title: "Group Created",
          description: "New group has been created successfully.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Create Failed",
          description: "An error occurred while creating the group.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateGroup = async (group: UIGroup, newTitle: string) => {
    try {
      await updateGroup.mutateAsync({
        ...group,
        title: newTitle,
      });
      toast({
        title: "Group Updated",
        description: "The group has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the group.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup.mutateAsync(groupId);
      toast({
        title: "Group Deleted",
        description: "The group has been deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the group.",
        variant: "destructive",
      });
    }
  };

  return {
    newGroupTitle,
    setNewGroupTitle,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    isCreatePending: createGroup.isPending,
    isUpdatePending: updateGroup.isPending,
    isDeletePending: deleteGroup.isPending,
  };
};
