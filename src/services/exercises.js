import { Exercises } from '../models/exercises.js';

const getAll = async () => {
  return await Exercises.find();
};

export default { getAll };
