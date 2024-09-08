import { LoaderPinwheel } from "lucide-react";

import {
  useCreateItem as useCreateItemApi,
  useGetItems,
} from "@/entities/item/api";
import { useCreateItem } from "@/entities/item/hooks";
import { ItemCard } from "@/entities/item/ui";
import { CreateEntry } from "@/shared/ui/CreateEntry";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/shadcn/alert";

type ItemListProps = {
  selectedGroup: UIGroup;
};

export function ItemList({ selectedGroup }: ItemListProps) {
  const { data, isLoading, error } = useGetItems(selectedGroup.id);
  const { newTitle, isCreatePending, setNewTitle, handleCreateItem } =
    useCreateItem({
      mutationHook: useCreateItemApi,
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
