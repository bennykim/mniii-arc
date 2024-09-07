import { EditableCard } from "@/components/Shared/EditableCard";

import { useDeleteItem, useUpdateItem } from "@/entities/item/api";
import { useEditableCard } from "@/hooks";

type ItemCardProps = {
  groupId: string;
  item: UIItem;
};

export function ItemCard({ groupId, item }: ItemCardProps) {
  const {
    editMode,
    EditTitle,
    setEditTitle,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    isUpdatePending,
  } = useEditableCard<UIItem>(item, useUpdateItem, useDeleteItem, groupId);

  return (
    <EditableCard
      data={item}
      editMode={editMode}
      EditTitle={EditTitle}
      onEditTitleChange={setEditTitle}
      onUpdate={handleUpdate}
      onEdit={handleEditClick}
      onCloseEdit={handleCloseEdit}
      onDelete={handleDelete}
      isUpdatePending={isUpdatePending}
    />
  );
}
