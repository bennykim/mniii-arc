import { memo, useState } from 'react';

import { VIRTUALIZATION } from '@/features/virtualizedListView/lib/constants';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';

type ItemContentProps = {
  url?: string;
  content?: string;
  isExpanded: boolean;
  enableAnimation: boolean;
};

const getContentClassNames = (enableAnimation: boolean, isExpanded: boolean) =>
  cn(
    'mt-2 overflow-hidden',
    enableAnimation &&
      `transition-all duration-${VIRTUALIZATION.ANIMATION_DURATION} ease-in-out`,
    {
      'max-h-0 opacity-0': !isExpanded,
      [`max-h-[${VIRTUALIZATION.MAX_EXPANDED_HEIGHT}px] opacity-100`]:
        isExpanded,
    },
  );

export const ItemContent = memo(function ItemContent({
  url,
  content,
  isExpanded,
  enableAnimation,
}: ItemContentProps) {
  const [isLoading, setIsLoading] = useState(!!url);

  return (
    <div className={getContentClassNames(enableAnimation, isExpanded)}>
      {content && <p className="text-sm text-gray-600">{content}</p>}
      {isLoading && (
        <Skeleton
          className="w-full rounded-md bg-slate-400"
          style={{ height: 300 }}
        />
      )}
      {url && (
        <img
          src={url}
          alt="random-image"
          className="w-full"
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
});
