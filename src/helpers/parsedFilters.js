export const parseFilter = (filter) => {
  const isString = typeof filter === 'string';
  if (!isString) return;
  const isFilter = (filter) =>
    ['bodyparts', 'muscles', 'equipment'].includes(filter);

  if (isFilter(filter)) return filter;
};
