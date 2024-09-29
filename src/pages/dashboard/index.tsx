import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/shadcn/tabs";
import { GroupManagement } from "@/widgets/GroupManagement";

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
            <GroupManagement />
          </TabsContent>
          <TabsContent value="menuB">...</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
