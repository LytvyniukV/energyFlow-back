import services from '../services/exercises.js';

const getAll = async (req, res) => {
  const exercises = await services.getAll(req.query);
  res.status(200).json({
    message: 'Success',
    ...exercises,
  });
};

export default { getAll };
