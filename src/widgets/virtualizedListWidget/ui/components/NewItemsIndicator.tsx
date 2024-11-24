import { type FakerTextDataItem } from '@/entities/faker/model/types';
import { cn } from '@/shared/lib/utils';

type NewItemsIndicatorProps = {
  latestData: FakerTextDataItem[];
  className?: string;
};

export const NewItemsIndicator = ({
  latestData,
  className,
}: NewItemsIndicatorProps) => {
  return (
    <div className={cn('flex items-center justify-end', className)}>
      {latestData.length > 0 && (
        <span className="flex items-center justify-center p-1 text-xs text-white rounded-full text-secondray bg-destructive min-w-6 w-fit h-fit">
          {latestData.length}
        </span>
      )}
    </div>
  );
};
