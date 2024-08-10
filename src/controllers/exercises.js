import { Exercises } from '../models/exercises.js';
import services from '../services/exercises.js';

const getAll = async (req, res) => {
  const exercises = await services.getAll(req.query);
  res.status(200).json({
    message: 'Success',
    ...exercises,
  });
};

const getById = async (req, res) => {
  const exercise = await services.getById(req.params.id);

  res.status(200).json({
    message: 'Succsess',
    data: exercise,
  });
};
export default { getAll, getById };
