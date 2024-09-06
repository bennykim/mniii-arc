import React from "react";

import { EditableCard } from "@/components/Shared/EditableCard";

import { useDeleteGroup, useEditableCard, useUpdateGroup } from "@/hooks";

type GroupCardProps = {
  group: UIGroup;
  selected: boolean;
  onSelect: (group: UIGroup) => void;
};

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  selected,
  onSelect,
}) => {
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
      selected={selected}
      onSelect={onSelect}
    />
  );
};
