import { Loader2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { POSITION } from '@/widgets/virtualizedListWidget/lib/constants';

type FetchIndicatorProps = {
  position: (typeof POSITION)[keyof typeof POSITION];
  enabled: boolean;
};

export const FetchIndicator = ({
  position = POSITION.BOTTOM,
  enabled = false,
}: FetchIndicatorProps) => (
  <div
    className={cn(
      'absolute left-0 right-0 flex justify-center items-center h-[100px] z-50 mx-auto',
      {
        '-top-[56px]': position === POSITION.TOP,
        '-bottom-[36px]': position === POSITION.BOTTOM,
        hidden: !enabled,
      },
    )}
  >
    <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
  </div>
);
