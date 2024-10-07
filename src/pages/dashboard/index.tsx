import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/shadcn/tabs";
import { GroupDashboard } from "@/widgets/GroupDashboard";
import { TimelineDashboard } from "@/widgets/TimelineDashboard";

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
            <GroupDashboard />
          </TabsContent>
          <TabsContent value="menuB">
            <TimelineDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
