import services from '../services/filters.js';

const getAll = async (req, res) => {
  const filters = await services.getAll(req.query);

  res.status(200).json({
    message: 'Success',
    ...filters,
  });
};

export default { getAll };
