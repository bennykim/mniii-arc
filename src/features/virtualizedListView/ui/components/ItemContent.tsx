import { memo } from 'react';

import { VIRTUALIZATION } from '@/features/virtualizedListView/lib/constants';
import { cn } from '@/shared/lib/utils';

type ItemContentProps = {
  content: string;
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
  content,
  isExpanded,
  enableAnimation,
}: ItemContentProps) {
  return (
    <div className={getContentClassNames(enableAnimation, isExpanded)}>
      <p className="leading-relaxed prose text-gray-700">{content}</p>
    </div>
  );
});
