import React, { useState } from "react";

import { Spinner } from "@/components/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupCard } from "./GroupCard";

import { useCreateGroup, useGroups } from "@/hooks";

interface GroupListProps {
  onSelectGroup: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onSelectGroup }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const { data: groups, isLoading, error } = useGroups();
  const createGroup = useCreateGroup();

  const handleCreateGroup = () => {
    createGroup.mutate({ name: newGroupName, items: [] });
    setNewGroupName("");
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
