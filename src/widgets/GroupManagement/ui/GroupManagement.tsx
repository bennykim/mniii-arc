import { Circle, CircleCheckBig, Edit, RefreshCcw } from "lucide-react";
import { useState } from "react";

import { useGetGroupsQuery } from "@/entities/group/api";
import { useGroupStore } from "@/entities/group/store";
import { useGetItemsQuery } from "@/entities/item/api";
import { useItemStore } from "@/entities/item/store";
import {
  CreateGroupForm,
  DeleteGroupButton,
  UpdateGroupForm,
} from "@/features/groupActions/ui";
import {
  CreateItemForm,
  DeleteItemButton,
  UpdateItemForm,
} from "@/features/itemActions/ui";
import { cn } from "@/shared/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/shadcn/accordion";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/shadcn/dialog";
import { TypographyP, TypographySpan } from "@/shared/ui/typography";

export function GroupManagement() {
  const { selectedGroup, editingGroup, selectGroup, editGroup } =
    useGroupStore();
  const { editingItem, editItem } = useItemStore();
  const {
    data: groups,
    isLoading,
    isRefetching,
    refetch,
  } = useGetGroupsQuery();
  const { data: items } = useGetItemsQuery(selectedGroup?.id ?? "");
  const [openItems, setOpenItems] = useState<string[]>(["groups", "items"]);

  const handleAccordionChange = (value: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(value);
      if (isOpen) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const isEditing = (
    editingEntity: UIGroup | UIItem | null,
    entity: UIGroup | UIItem
  ) => typeof editingEntity?.id === "string" && editingEntity?.id === entity.id;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">Groups Management</CardTitle>
        <Button variant="outline" className="m-3" onClick={() => refetch()}>
          <RefreshCcw
            size={16}
            className={cn({
              "animate-spin": isLoading || isRefetching,
            })}
          />
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
        >
          <AccordionItem value="groups">
            <AccordionTrigger
              className="uppercase"
              onClick={() => handleAccordionChange("groups")}
            >
              Groups
            </AccordionTrigger>
            <AccordionContent>
              <CreateGroupForm />
              {groups?.map((group, index) => (
                <div
                  key={`${group.id}-${index}`}
                  className="flex items-center justify-between mt-4"
                >
                  {isEditing(editingGroup, group) ? (
                    <UpdateGroupForm />
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => selectGroup(group)}
                        >
                          {selectedGroup?.id === group.id ? (
                            <CircleCheckBig size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                        </Button>
                        <TypographySpan text={group.title} />
                      </div>
                      <div className="space-x-2">
                        <Button type="button" onClick={() => editGroup(group)}>
                          <Edit size={16} />
                        </Button>
                        <DeleteGroupButton groupId={group.id} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="items">
            <AccordionTrigger
              className="uppercase"
              onClick={() => handleAccordionChange("items")}
            >
              Items
            </AccordionTrigger>
            <AccordionContent>
              {selectedGroup ? (
                <>
                  <CreateItemForm groupId={selectedGroup.id} />
                  {items?.list.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between mt-4"
                    >
                      {isEditing(editingItem, item) ? (
                        <UpdateItemForm groupId={selectedGroup.id} />
                      ) : (
                        <>
                          <TypographySpan text={item.title} className="pl-4" />
                          <div className="space-x-2">
                            <Button
                              type="button"
                              onClick={() => editItem(item)}
                            >
                              <Edit size={16} />
                            </Button>
                            <DeleteItemButton
                              groupId={selectedGroup.id}
                              itemId={item.id}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <TypographyP text="* Please select a group to manage items" />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Response</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Response</DialogTitle>
            </DialogHeader>
            <pre className="p-4 overflow-auto text-sm rounded-md">
              {JSON.stringify({ groups, items }, null, 2)}
            </pre>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
