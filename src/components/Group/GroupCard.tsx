import { Circle, CircleCheckBig, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useDeleteGroup, useUpdateGroup } from "@/hooks";

interface GroupCardProps {
  group: UIGroup;
  selected: boolean;
  onSelect: (group: UIGroup) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  selected,
  onSelect,
}) => {
  const [editGroupName, setEditGroupName] = useState("");

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

  const handleDeleteGroup = () => {
    deleteGroup.mutateAsync(group.id, {
      onSuccess: (_, id) => {
        console.log(`Group with id ${id} deleted`);
      },
    });
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
          <Button onClick={handleUpdateGroup} disabled={!editGroupName}>
            <Save size={16} />
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteGroup}
            disabled={deleteGroup.isPending}
          >
            <Trash2 size={16} />
          </Button>
          <Button variant="outline" onClick={() => onSelect(group)}>
            {selected ? <CircleCheckBig size={16} /> : <Circle size={16} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
