import React, { useState } from "react";

import { Spinner } from "@/components/Shared/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useDeleteGroup, useUpdateGroup } from "@/hooks";

interface GroupCardProps {
  group: UIGroup;
  onSelect: (group: UIGroup) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onSelect }) => {
  const [editGroupName, setEditGroupName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();

  const handleUpdateGroup = () => {
    updateGroup.mutate(
      {
        ...group,
        title: editGroupName,
      },
      {
        onSuccess: () => {
          setEditGroupName("");
        },
      }
    );
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup.mutateAsync(group.id);
    } catch (err) {
      console.warn(err);
      setError("Failed to delete group. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Edit group name"
            value={editGroupName}
            onChange={(e) => setEditGroupName(e.target.value)}
          />
          <Button onClick={handleUpdateGroup} disabled={updateGroup.isPending}>
            {updateGroup.isPending ? <Spinner /> : "Update"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteGroup}
            disabled={deleteGroup.isPending}
          >
            {deleteGroup.isPending ? <Spinner /> : "Delete"}
          </Button>
          <Button onClick={() => onSelect(group)}>Select</Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
