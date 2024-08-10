import { calculatePaginationData } from '../helpers/calculatePaginationData.js';
import HttpError from '../helpers/httpError.js';
import { parseFilter } from '../helpers/parsedFilters.js';
import { Filter } from '../models/filters.js';

const getAll = async (queryParams) => {
  const { page = 1, perPage = 10 } = queryParams;
  const filter = parseFilter(queryParams.filter);

  const options = {
    page: page,
    limit: perPage,
    customLabels: {
      docs: 'data',
    },
  };

  const filters = await Filter.paginate({ filter: filter }, options);

  if (!filters) throw HttpError(404, 'Filters not found');

  return filters;
};

export default { getAll };
