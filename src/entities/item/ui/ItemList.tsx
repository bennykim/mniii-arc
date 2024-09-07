import { LoaderPinwheel } from "lucide-react";

import { CreateEntry } from "@/components/Shared/CreateEntry";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCreateItem, useGetItems } from "@/entities/item/api";
import { ItemCard } from "@/entities/item/ui";
import { useCreateEntry } from "@/hooks";

type ItemListProps = {
  selectedGroup: UIGroup;
};

export function ItemList({ selectedGroup }: ItemListProps) {
  const { data, isLoading, error } = useGetItems(selectedGroup.id);
  const { newTitle, isCreatePending, setNewTitle, handleCreateItem } =
    useCreateEntry<UIItem>({
      mutationHook: useCreateItem,
      groupId: selectedGroup.id,
    });

  if (isLoading)
    return (
      <Alert>
        <AlertTitle className="text-center ">
          <LoaderPinwheel size={16} className="animate-spin" />
        </AlertTitle>
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
      <Alert>
        <AlertTitle>Selected Group: {selectedGroup.title}</AlertTitle>
      </Alert>
      <CreateEntry
        placeholder="New item title"
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        handleCreateItem={handleCreateItem}
        isCreatePending={isCreatePending}
      />
      {data?.list.map((item, index) => (
        <ItemCard key={index} groupId={selectedGroup.id} item={item} />
      ))}
    </div>
  );
}
