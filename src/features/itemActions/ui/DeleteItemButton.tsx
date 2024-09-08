import { Trash2 } from "lucide-react";

import { useItemActions } from "@/features/itemActions/hooks/useItemActions";
import { Button } from "@/shared/ui/shadcn/button";

type DeleteItemButtonProps = {
  groupId: string;
  itemId: string;
};

export function DeleteItemButton({ groupId, itemId }: DeleteItemButtonProps) {
  const { handleDeleteItem, isDeletePending } = useItemActions(groupId);

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => handleDeleteItem(itemId)}
      disabled={isDeletePending}
    >
      <Trash2 size={16} />
    </Button>
  );
}
