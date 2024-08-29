export const parseFilter = (filter) => {
  const isString = typeof filter === 'string';
  if (!isString) return;
  const isFilter = (filter) =>
    ['Body parts', 'Muscles', 'Equipment'].includes(filter);

  if (isFilter(filter)) return filter;
};
