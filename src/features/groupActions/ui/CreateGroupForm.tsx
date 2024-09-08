import { Plus } from "lucide-react";

import { useGroupActions } from "@/features/groupActions/hooks/useGroupActions";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";

export function CreateGroupForm() {
  const { newGroupTitle, setNewGroupTitle, handleCreateGroup } =
    useGroupActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      handleCreateGroup();
      setNewGroupTitle("");
    } catch (err) {
      console.error("Failed to create group.", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-1 pl-1 space-x-2">
      <Input
        value={newGroupTitle}
        onChange={(e) => setNewGroupTitle(e.target.value)}
        placeholder="New group title"
      />
      <Button type="submit" disabled={!newGroupTitle}>
        <Plus size={16} />
      </Button>
    </form>
  );
}
