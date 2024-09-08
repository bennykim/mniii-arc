import {
  useCreateGroup as useCreateGroupApi,
  useGetGroups,
} from "@/entities/group/api";
import { useCreateGroup } from "@/entities/group/hooks";
import { GroupCard } from "@/entities/group/ui";
import { CreateEntry } from "@/shared/ui/CreateEntry";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/shadcn/alert";

export function GroupList() {
  const { data: groups, isLoading, error } = useGetGroups();
  const { newTitle, isCreatePending, setNewTitle, handleCreateGroup } =
    useCreateGroup({ mutationHook: useCreateGroupApi });

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
      <CreateEntry
        placeholder="New group title"
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        handleCreateItem={handleCreateGroup}
        isCreatePending={isCreatePending}
      />
      {groups?.map((group, index) => (
        <GroupCard key={index} group={group} />
      ))}
    </div>
  );
}
