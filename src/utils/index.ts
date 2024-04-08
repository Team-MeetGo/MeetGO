export const getformattedDate = (date: string) =>
  new Date(date).toLocaleString('ko', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

export const getFromTo = (loadCount: number, idx: number) => {
  let from = loadCount * (idx + 1);
  let to = from + idx;

  return { from, to };
};
