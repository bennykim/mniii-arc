import { Plus } from 'lucide-react';

import { useItemActions } from '@/features/itemManagement/hooks/useItemActions';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';

type CreateItemFormProps = {
  groupId: string;
};

export function CreateItemForm({ groupId }: CreateItemFormProps) {
  const { newItemTitle, setNewItemTitle, handleCreateItem } =
    useItemActions(groupId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      handleCreateItem();
      setNewItemTitle('');
    } catch (err) {
      console.error('Failed to create item.', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-1 pl-1 space-x-2 ">
      <Input
        value={newItemTitle}
        onChange={(e) => setNewItemTitle(e.target.value)}
        placeholder="New item title"
      />
      <Button type="submit" disabled={!newItemTitle} data-cy="add-item-button">
        <Plus size={16} />
      </Button>
    </form>
  );
}
