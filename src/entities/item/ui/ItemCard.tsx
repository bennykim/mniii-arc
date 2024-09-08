import {
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "@/entities/item/api";
import { useEditableItem } from "@/entities/item/hooks";
import { EditableCard } from "@/shared/ui/EditableCard";

type ItemCardProps = {
  groupId: string;
  item: UIItem;
};

export function ItemCard({ groupId, item }: ItemCardProps) {
  const {
    editMode,
    editTitle,
    setEditTitle,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    isUpdatePending,
  } = useEditableItem(
    item,
    useUpdateItemMutation,
    useDeleteItemMutation,
    groupId
  );

  return (
    <EditableCard
      data={item}
      editMode={editMode}
      EditTitle={editTitle}
      onEditTitleChange={setEditTitle}
      onUpdate={handleUpdate}
      onEdit={handleEditClick}
      onCloseEdit={handleCloseEdit}
      onDelete={handleDelete}
      isUpdatePending={isUpdatePending}
    />
  );
}
