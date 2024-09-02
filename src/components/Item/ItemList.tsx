import React, { useState } from "react";

import { Spinner } from "@/components/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCard } from "./ItemCard";

import { useCreateItem, useItems } from "@/hooks";

interface ItemListProps {
  selectedGroup: Group;
}

export const ItemList: React.FC<ItemListProps> = ({ selectedGroup }) => {
  const [newItemName, setNewItemName] = useState("");
  const { data: items, isLoading, error } = useItems(selectedGroup.id);
  const createItem = useCreateItem(selectedGroup.id);

  const handleCreateItem = () => {
    createItem.mutate({ name: newItemName });
    setNewItemName("");
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
        <AlertTitle>Selected Group: {selectedGroup.name}</AlertTitle>
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
      {items?.map((item) => (
        <ItemCard key={item.id} groupId={selectedGroup.id} item={item} />
      ))}
    </div>
  );
};
