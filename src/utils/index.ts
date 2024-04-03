export const getformattedDate = (date: string) =>
  new Date(date).toLocaleString('ko', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

export const ITEM_INTERVAL = 2;

export const getFromTo = (loadCount: number, num: number) => {
  let from = loadCount * (num + 1);
  let to = from + num;

  return { from, to };
};
