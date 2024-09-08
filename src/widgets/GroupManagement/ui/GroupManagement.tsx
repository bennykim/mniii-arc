import { RefreshCcw } from "lucide-react";
import { useState } from "react";

import { useGetGroupsQuery } from "@/entities/group/api";
import { useSelectedStore } from "@/entities/group/store";
import { GroupList } from "@/entities/group/ui";
import { useGetItemsQuery } from "@/entities/item/api";
import { ItemList } from "@/entities/item/ui";
import { cn } from "@/shared/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/shadcn/accordion";
import { Alert, AlertDescription } from "@/shared/ui/shadcn/alert";
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

export function GroupManagement() {
  const { selectedGroup } = useSelectedStore();

  const [openItems, setOpenItems] = useState<string[]>(["groups", "items"]);

  const {
    data: groups,
    isLoading,
    isRefetching,
    refetch,
  } = useGetGroupsQuery();
  const { data: items } = useGetItemsQuery(selectedGroup?.id ?? "");

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

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">Groups Testing</CardTitle>
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
            <AccordionTrigger onClick={() => handleAccordionChange("groups")}>
              Groups
            </AccordionTrigger>
            <AccordionContent>
              <GroupList />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="items">
            <AccordionTrigger onClick={() => handleAccordionChange("items")}>
              Items
            </AccordionTrigger>
            <AccordionContent>
              {selectedGroup ? (
                <ItemList selectedGroup={selectedGroup} />
              ) : (
                <Alert>
                  <AlertDescription>
                    Please select a group to manage items
                  </AlertDescription>
                </Alert>
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
