import {
  CARD_HEIGHT,
  CARD_WIDTH,
} from '@/features/infiniteSliderView/lib/constants';
import { type InfiniteSliderListItemProps } from '@/features/infiniteSliderView/ui/InfiniteSliderListItem';

const CARDS = Array.from({ length: 30 }, (_, i) => i + 1);

type InfiniteSliderListProps = {
  galleryRef?: React.RefObject<HTMLDivElement>;
  cardsRef?: React.RefObject<HTMLUListElement>;
  children: (props: InfiniteSliderListItemProps) => React.ReactNode;
};

export const InfiniteSliderList = ({
  galleryRef,
  cardsRef,
  children,
}: InfiniteSliderListProps) => {
  return (
    <div
      className="h-full relative overflow-auto [scrollbar-width:none] [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden"
    >
      <div
        ref={galleryRef}
        className="relative gallery"
        style={{ height: `${CARDS.length * CARD_HEIGHT}px` }}
      >
        <ul
          ref={cardsRef}
          className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none cards left-1/2 top-1/2"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          {CARDS.map((num) => {
            return children({
              id: num,
            });
          })}
        </ul>
      </div>
    </div>
  );
};
