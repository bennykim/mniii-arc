import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/shadcn/tabs";
import { GroupManagerWidget } from "@/widgets/groupManagerWidget/ui";
import { TimelineWidget } from "@/widgets/timelineWidget/ui";
import { VirtualizedListWidget } from "@/widgets/virtualizedListWidget/ui";

function DashboardPage() {
  return (
    <div className="h-screen bg-gradient-to-t from-blue-600 to-yellow-50 dark:to-blue-600 dark:from-yellow-50">
      <div className="container p-4 mx-auto">
        <Tabs defaultValue="GroupManager">
          <TabsList>
            <TabsTrigger value="GroupManager">Group Manager</TabsTrigger>
            <TabsTrigger value="Timeline">Timeline</TabsTrigger>
            <TabsTrigger value="OptimizedList">Optimized List</TabsTrigger>
          </TabsList>
          <TabsContent value="GroupManager">
            <GroupManagerWidget />
          </TabsContent>
          <TabsContent value="Timeline">
            <TimelineWidget />
          </TabsContent>
          <TabsContent value="OptimizedList">
            <VirtualizedListWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
