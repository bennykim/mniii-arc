const toUTCDate = (date: string | Date): Date => {
  return new Date(new Date(date).toISOString());
};

export const getTimestamp = (date: string | Date = new Date()): number => {
  return toUTCDate(date).getTime();
};

export const getISODateString = (date: Date = new Date()): string => {
  return toUTCDate(date).toISOString();
};

export const formatDateLocale = (
  date: string | Date,
  locale: string = 'en-US',
): string => {
  return toUTCDate(date).toLocaleString(locale, { timeZone: 'UTC' });
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(toUTCDate(date).getTime() + minutes * 60 * 1000);
};

export const addRandomMinutes = (
  date: Date,
  min: number = 2,
  range: number = 4,
): Date => {
  const minutesToAdd = min + Math.floor(Math.random() * range);
  return addMinutes(toUTCDate(date), minutesToAdd);
};
