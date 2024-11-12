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

export type GetFakerImagesParams = {
  quantity: number;
  height: number;
};

export type FakerImageDataItem = {
  order: number;
  title: string;
  description: string;
  url: string;
};

export type FakerImageResponse = {
  status: 'OK' | 'ERROR';
  code: number;
  locale: string;
  seed: string | null;
  total: number;
  data: FakerImageDataItem[];
};
