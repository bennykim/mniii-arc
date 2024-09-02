import { useCreateGroup, useDeleteGroup, useGroups } from "../hooks";

const GroupList = () => {
  const { data: groups, isLoading, error } = useGroups();
  const createGroupMutation = useCreateGroup();
  const deleteGroupMutation = useDeleteGroup();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error occurred: {error.message}</div>;

  const handleCreateGroup = () => {
    createGroupMutation.mutate({ name: "New Group", items: [] });
  };

  const handleDeleteGroup = (id: string) => {
    deleteGroupMutation.mutate(id);
  };

  return (
    <div>
      <h1>Groups</h1>
      <ul>
        {groups?.map((group) => (
          <li key={group.id}>
            {group.name}
            <button onClick={() => handleDeleteGroup(group.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCreateGroup}>Add Group</button>
    </div>
  );
};

export default GroupList;
