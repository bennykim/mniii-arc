import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";

type CreateEntryProps = {
  placeholder: string;
  newTitle: string;
  setNewTitle: (title: string) => void;
  handleCreateItem: () => void;
  isCreatePending: boolean;
};

export function CreateEntry({
  placeholder,
  newTitle,
  setNewTitle,
  handleCreateItem,
  isCreatePending,
}: CreateEntryProps) {
  return (
    <div className="flex p-1 space-x-2">
      <Input
        placeholder={placeholder}
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <Button
        disabled={!newTitle || isCreatePending}
        onClick={handleCreateItem}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}
