import { ChevronUp } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/shared/ui/shadcn/button';

type ScrollControlsProps = {
  controls: {
    scrollToTop: () => void;
  } | null;
  children?: React.ReactNode;
};

export const ScrollControls = memo(function ScrollControls({
  controls,
  children,
}: ScrollControlsProps) {
  if (!controls) return null;

  return (
    <div className="relative">
      <Button
        className="w-10 h-10 p-2 rounded-full shadow-lg"
        onClick={controls.scrollToTop}
        variant="outline"
        size="icon"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
      <span className="absolute -top-2 -right-2">{children}</span>
    </div>
  );
});
