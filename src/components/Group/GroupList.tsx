import React, { useState } from "react";

import { GroupCard } from "@/components/Group";
import { Spinner } from "@/components/Shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateGroup, useGroups } from "@/hooks";

interface GroupListProps {
  onSelectGroup: (group: UIGroup) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onSelectGroup }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const { data: groups, isLoading, error } = useGroups();

  const createGroup = useCreateGroup();

  const handleCreateGroup = () => {
    createGroup.mutate(
      { title: newGroupName, list: [] },
      {
        onSuccess: () => {
          setNewGroupName("");
        },
      }
    );
  };

  if (isLoading)
    return (
      <Alert>
        <AlertTitle>Loading...</AlertTitle>
      </Alert>
    );

  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-4">
      <div className="flex p-1 space-x-2">
        <Input
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Button
          disabled={!newGroupName || createGroup.isPending}
          onClick={handleCreateGroup}
        >
          {createGroup.isPending ? <Spinner /> : "Create Group"}
        </Button>
      </div>
      {groups?.map((group) => (
        <GroupCard key={group.id} group={group} onSelect={onSelectGroup} />
      ))}
    </div>
  );
};
