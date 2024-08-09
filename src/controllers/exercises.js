import services from '../services/exercises.js';

const getAll = async (req, res) => {
  const exercises = await services.getAll();
  res.status(200).json({
    message: 'Success',
    data: exercises,
  });
};

export default { getAll };
