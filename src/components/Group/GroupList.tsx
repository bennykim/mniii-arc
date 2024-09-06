import { Plus } from "lucide-react";
import React, { useState } from "react";

import { GroupCard } from "@/components/Group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateGroup, useGroups } from "@/hooks";

export const GroupList: React.FC = () => {
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
          <Plus size={16} />
        </Button>
      </div>
      {groups?.map((group, index) => (
        <GroupCard key={index} group={group} />
      ))}
    </div>
  );
};
