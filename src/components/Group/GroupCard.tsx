import { EditableCard } from "@/components/Shared/EditableCard";

import { useDeleteGroup, useUpdateGroup } from "@/entities/group/api";
import { useEditableCard } from "@/hooks";
import { useSelectedStore } from "@/store";

type GroupCardProps = {
  group: UIGroup;
};

export function GroupCard({ group }: GroupCardProps) {
  const { selectedGroup, selectGroup, unselectGroup } = useSelectedStore();
  const isSelected = selectedGroup?.id === group.id;
  const {
    editMode,
    EditTitle,
    setEditTitle,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    isUpdatePending,
  } = useEditableCard<UIGroup>(group, useUpdateGroup, useDeleteGroup);

  const handleSelect = () => {
    if (isSelected) {
      unselectGroup();
    } else {
      selectGroup(group);
    }
  };

  return (
    <EditableCard
      data={group}
      editMode={editMode}
      EditTitle={EditTitle}
      onEditTitleChange={setEditTitle}
      onUpdate={handleUpdate}
      onEdit={handleEditClick}
      onCloseEdit={handleCloseEdit}
      onDelete={handleDelete}
      isUpdatePending={isUpdatePending}
      selected={isSelected}
      onSelect={handleSelect}
    />
  );
}
