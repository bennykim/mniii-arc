import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/tabs';
import { GroupManagerWidget } from '@/widgets/groupManagerWidget/ui';
import { InfiniteSliderWidget } from '@/widgets/infiniteSliderWidget/ui';
import { TimelineWidget } from '@/widgets/timelineWidget/ui';
import { VirtualizedListWidget } from '@/widgets/virtualizedListWidget/ui';

function DashboardPage() {
  return (
    <div className="h-screen">
      <div className="container p-4 mx-auto">
        <Tabs defaultValue="Slides">
          <TabsList className="glass">
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue  data-[state=active]:dark:bg-light-grey-blue-dark"
              value="Slides"
            >
              Infinite Slider
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue  data-[state=active]:dark:bg-light-grey-blue-dark"
              value="GroupManager"
            >
              Group Manager
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue  data-[state=active]:dark:bg-light-grey-blue-dark"
              value="Timeline"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-grey-blue  data-[state=active]:dark:bg-light-grey-blue-dark"
              value="VirtualizedList"
            >
              Virtualized List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Slides">
            <InfiniteSliderWidget />
          </TabsContent>
          <TabsContent value="GroupManager">
            <GroupManagerWidget />
          </TabsContent>
          <TabsContent value="Timeline">
            <TimelineWidget />
          </TabsContent>
          <TabsContent value="VirtualizedList">
            <VirtualizedListWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
