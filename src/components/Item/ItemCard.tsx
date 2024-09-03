import React, { useState } from "react";

import { Spinner } from "@/components/Shared/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useDeleteItem, useUpdateItem } from "@/hooks";

interface ItemCardProps {
  groupId: string;
  item: UIItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ groupId, item }) => {
  const [editItemName, setEditItemName] = useState("");

  const updateItem = useUpdateItem(groupId);
  const deleteItem = useDeleteItem(groupId);

  const handleUpdateItem = () => {
    updateItem.mutate(
      {
        ...item,
        title: editItemName,
      },
      {
        onSuccess: () => {
          setEditItemName("");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Edit item name"
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
          />
          <Button
            onClick={handleUpdateItem}
            disabled={updateItem.isPending || !editItemName}
          >
            {updateItem.isPending ? <Spinner /> : "Update"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteItem.mutate(item.id)}
            disabled={deleteItem.isPending}
          >
            {deleteItem.isPending ? <Spinner /> : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
