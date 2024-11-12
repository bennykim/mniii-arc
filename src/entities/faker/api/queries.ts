import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

import { apiService } from '@/entities/faker/api/base';
import {
  type FakerTextDataItem,
  type FakerTextResponse,
  type GetFakerImagesParams,
  type GetFakerTextsParams,
} from '@/entities/faker/model/types';
import { useDelay } from '@/shared/hooks';

const CHARACTERS = {
  MIN: 500,
  MAX: 1500,
};

export const generateRandomCharacters = ({
  min = CHARACTERS.MIN,
  max = CHARACTERS.MAX,
}) => Math.floor(Math.random() * (max - min + 1)) + min;

interface UseGetFakerTextsParams extends GetFakerTextsParams {
  page: number;
}

export const useGetFakerTexts = (
  params: UseGetFakerTextsParams,
  options?: { enabled?: boolean },
) => {
  const charactersRef = useRef(
    generateRandomCharacters({
      min: params.characters,
      max: params.characters * 3,
    }),
  );

  const queryKey = [
    'faker',
    'texts',
    {
      quantity: params.quantity,
      characters: charactersRef.current,
      page: params.page,
    },
  ];

  return useQuery<FakerTextResponse, Error, FakerTextDataItem[]>({
    queryKey,
    queryFn: () =>
      apiService.getTexts({
        quantity: params.quantity,
        characters: charactersRef.current,
      }),
    refetchInterval: false,
    enabled: options?.enabled,
    select: (data) =>
      data.data.map((item, index) => ({
        ...item,
        order: index + (params.page - 1) * params.quantity,
      })),
  });
};

interface UseGetFakerImagesParams extends GetFakerImagesParams {
  page: number;
}

export const useGetFakerImages = (
  params: UseGetFakerImagesParams,
  options?: { enabled?: boolean },
) => {
  const queryKey = [
    'faker',
    'images',
    {
      quantity: params.quantity,
      height: params.height,
      page: params.page,
    },
  ];

  return useQuery<FakerTextResponse, Error, FakerTextDataItem[]>({
    queryKey,
    queryFn: () =>
      apiService.getImages({
        quantity: params.quantity,
        height: params.height,
      }),
    refetchInterval: false,
    enabled: options?.enabled,
    select: (data) =>
      data.data.map((item, index) => ({
        ...item,
        order: index + (params.page - 1) * params.quantity,
      })),
  });
};

export const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

type UseDynamicPrependTextsParams = {
  characters: number;
};

export const useDynamicPrependTexts = (
  params: UseDynamicPrependTextsParams,
) => {
  const quantity = useRef(generateRandomNumber(1, 3));
  const isReady = useDelay(5000);

  const queryKey = [
    'faker',
    'prepend-texts',
    {
      quantity: quantity.current,
      characters: params.characters,
    },
  ];

  return useQuery<FakerTextResponse, Error, FakerTextDataItem[]>({
    queryKey,
    queryFn: () =>
      apiService.getTexts({
        quantity: quantity.current,
        characters: params.characters,
      }),
    enabled: isReady,
    refetchInterval: generateRandomNumber(1000 * 5, 1000 * 10),
    select: (data) =>
      data.data.map((item, index) => ({
        ...item,
        order: index,
      })),
  });
};
