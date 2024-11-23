import { useInfiniteSlider } from '@/features/infiniteSliderView/hook/useInfiniteSlider';
import { InfiniteSlider } from '@/features/infiniteSliderView/ui';
import { OptimizedSliderImage } from '@/shared/ui/OptimizedSliderImage';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import { ScrollIndicator } from '@/widgets/infiniteSliderWidget/ui/components/ScrollIndicator';

export function InfiniteSliderWidget() {
  const { galleryRef, cardsRef, handleNext, handlePrev } = useInfiniteSlider();

  return (
    <Card className="w-full max-w-5xl mx-auto mt-8 glass h-[660px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Infinite Slider</CardTitle>
        <ScrollIndicator />
      </CardHeader>

      <CardContent className="relative h-[460px]">
        <InfiniteSlider.List galleryRef={galleryRef} cardsRef={cardsRef}>
          {({ id }) => (
            <InfiniteSlider.Item key={id} id={id}>
              {({ src, alt, width, height }) => (
                <OptimizedSliderImage
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                />
              )}
            </InfiniteSlider.Item>
          )}
        </InfiniteSlider.List>
      </CardContent>

      <CardFooter className="flex justify-center">
        <InfiniteSlider.Control
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </CardFooter>
    </Card>
  );
}
