import { LoaderPinwheel } from "lucide-react";

import { Card } from "@/shared/ui/shadcn/card";

export const LoadingIndicator = () => (
  <Card className="w-full h-40 max-w-4xl mx-auto mt-8">
    <div className="flex items-center justify-center h-full">
      <LoaderPinwheel size={22} className="animate-spin" />
    </div>
  </Card>
);
