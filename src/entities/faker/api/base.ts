export type GetFakerTextsParams = {
  quantity: number;
  characters: number;
};

export type FakerTextDataItem = {
  order: number;
  title: string;
  author: string;
  genre: string;
  content: string;
};

export type FakerTextResponse = {
  status: "OK" | "ERROR";
  code: number;
  locale: string;
  seed: string | null;
  total: number;
  data: FakerTextDataItem[];
};

const FAKER_API_BASE_URL = "https://fakerapi.it/api/v2";

export const apiService = {
  getTexts: async ({ quantity, characters }: GetFakerTextsParams) => {
    const response = await fetch(
      `${FAKER_API_BASE_URL}/texts?_quantity=${quantity}&_characters=${characters}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },
};
