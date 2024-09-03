import React, { useState } from "react";

import { ItemCard } from "@/components/Item";
import { Spinner } from "@/components/Shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateItem, useItems } from "@/hooks";

interface ItemListProps {
  selectedGroup: UIGroup;
}

export const ItemList: React.FC<ItemListProps> = ({ selectedGroup }) => {
  const [newItemName, setNewItemName] = useState("");

  const { data, isLoading, error } = useItems(selectedGroup.id);
  const createItem = useCreateItem(selectedGroup.id);

  const handleCreateItem = () => {
    createItem.mutate(
      { title: newItemName },
      {
        onSuccess: () => {
          setNewItemName("");
        },
      }
    );
  };

  if (isLoading)
    return (
      <Alert>
        <AlertTitle>Loading items...</AlertTitle>
      </Alert>
    );
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Selected Group: {selectedGroup.title}</AlertTitle>
      </Alert>
      <div className="flex p-1 space-x-2">
        <Input
          placeholder="New item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button
          onClick={handleCreateItem}
          disabled={createItem.isPending || !newItemName}
        >
          {createItem.isPending ? <Spinner /> : "Create Item"}
        </Button>
      </div>
      {data?.list.map((item) => (
        <ItemCard key={item.id} groupId={selectedGroup.id} item={item} />
      ))}
    </div>
  );
};
