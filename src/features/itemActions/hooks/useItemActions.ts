import { useState } from "react";

import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "@/entities/item/api";
import { useToast } from "@/shared/hooks/use-toast";

export const useItemActions = (groupId: string) => {
  const { toast } = useToast();
  const [newItemTitle, setNewItemTitle] = useState("");

  const createItem = useCreateItemMutation(groupId);
  const updateItem = useUpdateItemMutation(groupId);
  const deleteItem = useDeleteItemMutation(groupId);

  const handleCreateItem = async () => {
    if (newItemTitle.trim()) {
      try {
        await createItem.mutateAsync({
          title: newItemTitle,
        });
        setNewItemTitle("");
        toast({
          title: "Item Created",
          description: "New item has been created successfully.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Create Failed",
          description: "An error occurred while creating the item.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateItem = async (item: UIItem, newTitle: string) => {
    try {
      await updateItem.mutateAsync({
        ...item,
        title: newTitle,
      });
      toast({
        title: "Item Updated",
        description: "The item has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the item.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem.mutateAsync(itemId);
      toast({
        title: "Item Deleted",
        description: "The item has been deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the item.",
        variant: "destructive",
      });
    }
  };

  return {
    newItemTitle,
    setNewItemTitle,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    isCreatePending: createItem.isPending,
    isUpdatePending: updateItem.isPending,
    isDeletePending: deleteItem.isPending,
  };
};
