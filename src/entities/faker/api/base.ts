import { type GetFakerTextsParams } from '@/entities/faker/model/types';

const FAKER_API_BASE_URL = 'https://fakerapi.it/api/v2';

export const apiService = {
  getTexts: async ({ quantity, characters }: GetFakerTextsParams) => {
    const response = await fetch(
      `${FAKER_API_BASE_URL}/texts?_quantity=${quantity}&_characters=${characters}`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
};
