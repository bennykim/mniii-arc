import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/shadcn/button';

type InfiniteSliderControlProps = {
  handlePrev: () => void;
  handleNext: () => void;
};

export const InfiniteSliderControl = ({
  handlePrev,
  handleNext,
}: InfiniteSliderControlProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={handlePrev}>
        <ChevronLeft size={24} />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleNext}>
        <ChevronRight size={24} />
      </Button>
    </div>
  );
};
