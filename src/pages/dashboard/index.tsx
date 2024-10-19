import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/shadcn/tabs";
import { GroupManagerWidget } from "@/widgets/GroupManagerWidget/ui";
import { TimelineWidget } from "@/widgets/TimelineWidget/ui";

function DashboardPage() {
  return (
    <div className="h-screen bg-gradient-to-t from-blue-600 to-yellow-50 dark:to-blue-600 dark:from-yellow-50">
      <div className="container p-4 mx-auto">
        <Tabs defaultValue="menuA">
          <TabsList>
            <TabsTrigger value="menuA">Menu A</TabsTrigger>
            <TabsTrigger value="menuB">Menu B</TabsTrigger>
          </TabsList>
          <TabsContent value="menuA">
            <GroupManagerWidget />
          </TabsContent>
          <TabsContent value="menuB">
            <TimelineWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
