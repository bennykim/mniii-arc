import React from "react";

import { EditableCard } from "@/components/Shared/EditableCard";

import { useDeleteItem, useEditableCard, useUpdateItem } from "@/hooks";

type ItemCardProps = {
  groupId: string;
  item: UIItem;
};

export const ItemCard: React.FC<ItemCardProps> = ({ groupId, item }) => {
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
  } = useEditableCard<UIItem>(item, useUpdateItem, useDeleteItem, groupId);

  return (
    <EditableCard
      data={item}
      editMode={editMode}
      editName={editName}
      onEditNameChange={setEditName}
      onUpdate={handleUpdate}
      onEdit={handleEditClick}
      onCloseEdit={handleCloseEdit}
      onDelete={handleDelete}
      isUpdatePending={updateMutation.isPending}
      isDeletePending={deleteMutation.isPending}
    />
  );
};
