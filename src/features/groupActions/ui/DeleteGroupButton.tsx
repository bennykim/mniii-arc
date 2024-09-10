import { Trash2 } from "lucide-react";

import { useGroupActions } from "@/features/groupActions/hooks/useGroupActions";
import { Button } from "@/shared/ui/shadcn/button";

type DeleteGroupButtonProps = {
  groupId: string;
};

export function DeleteGroupButton({ groupId }: DeleteGroupButtonProps) {
  const { handleDeleteGroup, isDeletePending } = useGroupActions();

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => handleDeleteGroup(groupId)}
      disabled={isDeletePending}
      data-cy="del-group-button"
    >
      <Trash2 size={16} />
    </Button>
  );
}
