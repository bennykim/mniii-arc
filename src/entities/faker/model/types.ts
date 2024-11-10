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
  status: 'OK' | 'ERROR';
  code: number;
  locale: string;
  seed: string | null;
  total: number;
  data: FakerTextDataItem[];
};
