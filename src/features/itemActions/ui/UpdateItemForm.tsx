import { LoaderPinwheel, Save, X } from "lucide-react";
import { useState } from "react";

import { useItemStore } from "@/entities/item/store";
import { useItemActions } from "@/features/itemActions/hooks/useItemActions";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";

type UpdateItemFormProps = {
  groupId: string;
};

export function UpdateItemForm({ groupId }: UpdateItemFormProps) {
  const { editingItem: item, editItem } = useItemStore();
  const [newTitle, setNewTitle] = useState(item?.title || "");
  const { handleUpdateItem, isUpdatePending } = useItemActions(groupId);

  const onCancel = () => {
    editItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    try {
      await handleUpdateItem(item, newTitle);
      onCancel();
    } catch (err) {
      console.error(`Failed to update item with id: ${item.id}.`, err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full pl-1 space-x-2">
      <Input
        autoFocus
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Edit name"
        data-cy="edit-item-input"
      />
      <Button
        type="submit"
        disabled={!newTitle || isUpdatePending}
        data-cy="save-item-button"
      >
        {isUpdatePending ? (
          <LoaderPinwheel size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="max-w-12"
        onClick={onCancel}
      >
        <X size={16} />
      </Button>
    </form>
  );
}
