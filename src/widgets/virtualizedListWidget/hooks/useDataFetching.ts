import {
  useGetFakerImages,
  useGetFakerTexts,
} from '@/entities/faker/api/queries';

type UseDataFetchingPops = { page: number };

export const useDataFetching = ({ page }: UseDataFetchingPops) => {
  const isEnabledTextData = page > 0 && page % 2 === 1;
  const isEnabledImageData = page > 0 && page % 2 === 0;

  const {
    data: appendTextData,
    isLoading: isTextLoading,
    isFetching: isTextFetching,
  } = useGetFakerTexts(
    {
      page,
      quantity: 20,
      characters: 500,
    },
    {
      enabled: isEnabledTextData,
    },
  );

  const {
    data: appendImageData,
    isLoading: isImageLoading,
    isFetching: isImageFetching,
  } = useGetFakerImages(
    {
      page,
      quantity: 20,
      height: 300,
    },
    {
      enabled: isEnabledImageData,
    },
  );

  return {
    appendData: page % 2 === 1 ? appendTextData : appendImageData,
    isLoading: isTextLoading || isImageLoading,
    isFetching: isTextFetching || isImageFetching,
  };
};
