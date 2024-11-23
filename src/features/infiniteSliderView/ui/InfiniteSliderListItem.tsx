import {
  CARD_HEIGHT,
  CARD_WIDTH,
} from '@/features/infiniteSliderView/lib/constants';
import { OptimizedSliderImageProps } from '@/shared/ui/OptimizedSliderImage';

export type InfiniteSliderListItemProps = {
  id: number;
  children?: (props: OptimizedSliderImageProps) => React.ReactNode;
};

export const InfiniteSliderListItem = ({
  id,
  children,
}: InfiniteSliderListItemProps) => {
  return (
    <li
      key={id}
      className="absolute top-0 left-0 flex items-center justify-center rounded-lg bg-light-grey-blue-dark text-3xl"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {children ? (
        children({
          src: `/images/slider/${id}.webp`,
          alt: `Slide ${id} Image`,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        })
      ) : (
        <span>{id}</span>
      )}
    </li>
  );
};
