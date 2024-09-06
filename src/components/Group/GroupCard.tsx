import React from "react";

import { EditableCard } from "@/components/Shared/EditableCard";

import { useDeleteGroup, useEditableCard, useUpdateGroup } from "@/hooks";
import { useSelectedStore } from "@/store";

type GroupCardProps = {
  group: UIGroup;
};

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { selectedGroup, selectGroup, unselectGroup } = useSelectedStore();
  const isSelected = selectedGroup?.id === group.id;

  const {
    editMode,
    editName,
    setEditName,
    handleUpdate,
    handleDelete,
    handleEditClick,
    handleCloseEdit,
    updateMutation,
    deleteMutation,
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
      editName={editName}
      onEditNameChange={setEditName}
      onUpdate={handleUpdate}
      onEdit={handleEditClick}
      onCloseEdit={handleCloseEdit}
      onDelete={handleDelete}
      isUpdatePending={updateMutation.isPending}
      isDeletePending={deleteMutation.isPending}
      selected={isSelected}
      onSelect={handleSelect}
    />
  );
};
