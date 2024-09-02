import React, { useState } from "react";

import { GroupList } from "@/components/Group/GroupList";
import { ItemList } from "@/components/Item/ItemList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useGroups, useItems } from "@/hooks";

const DashboardScreen: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>(["groups", "items"]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { data: groups } = useGroups();
  const { data: items } = useItems(selectedGroup?.id ?? "");

  const handleAccordionChange = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Groups Testing</CardTitle>
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
              <GroupList onSelectGroup={setSelectedGroup} />
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
};

export default DashboardScreen;