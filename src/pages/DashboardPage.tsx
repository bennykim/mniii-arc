import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/tabs';
import { GroupManagerWidget } from '@/widgets/groupManagerWidget/ui';
import { TimelineWidget } from '@/widgets/timelineWidget/ui';
import { VirtualizedListWidget } from '@/widgets/virtualizedListWidget/ui';

function DashboardPage() {
  return (
    <div className="h-screen">
      <div className="container p-4 mx-auto">
        <Tabs defaultValue="GroupManager">
          <TabsList className="glass">
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue"
              value="GroupManager"
            >
              Group Manager
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue"
              value="Timeline"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue"
              value="OptimizedList"
            >
              Optimized List
            </TabsTrigger>
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
