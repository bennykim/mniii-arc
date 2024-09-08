import {
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from "@/entities/group/api";
import { useEditableGroup } from "@/entities/group/hooks";
import { useSelectedStore } from "@/entities/group/store";
import { EditableCard } from "@/shared/ui/EditableCard";

type GroupCardProps = {
  group: UIGroup;
};

export function GroupCard({ group }: GroupCardProps) {
  const { selectedGroup, selectGroup, unselectGroup } = useSelectedStore();
  const isSelected = selectedGroup?.id === group.id;
  const {
    editMode,
    editTitle,
    setEditTitle,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    isUpdatePending,
  } = useEditableGroup(group, useUpdateGroupMutation, useDeleteGroupMutation);

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
      EditTitle={editTitle}
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
