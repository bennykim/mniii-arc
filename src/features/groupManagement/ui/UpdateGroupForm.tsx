import { LoaderPinwheel, Save, X } from "lucide-react";
import { useState } from "react";

import { useGroupStore } from "@/entities/group/store";
import { useGroupActions } from "@/features/groupManagement/hooks/useGroupActions";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";

export function UpdateGroupForm() {
  const { editingGroup: group, editGroup } = useGroupStore();
  const [newTitle, setNewTitle] = useState(group?.title || "");
  const { handleUpdateGroup, isUpdatePending } = useGroupActions();

  const onCancel = () => {
    editGroup(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!group) return;

    try {
      await handleUpdateGroup(group, newTitle);
      onCancel();
    } catch (err) {
      console.error(`Failed to update group with id: ${group.id}.`, err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full pl-1 space-x-2">
      <Input
        autoFocus
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Edit name"
        data-cy="edit-group-input"
      />
      <Button
        type="submit"
        disabled={!newTitle || isUpdatePending}
        data-cy="save-group-button"
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
