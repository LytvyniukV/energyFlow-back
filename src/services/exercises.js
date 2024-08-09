import { calculatePaginationData } from '../helpers/calculatePaginationData.js';
import { Exercises } from '../models/exercises.js';

const getAll = async (queryParams) => {
  const { bodyParts, muscles, equipment, q } = queryParams;
  const { page = 1, perPage = 10 } = queryParams;

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const exercisesQuery = Exercises.find();

  if (bodyParts) {
    exercisesQuery.where('bodyPart').equals(bodyParts);
  }
  if (muscles) {
    exercisesQuery.where('target').equals(muscles);
  }
  if (equipment) {
    exercisesQuery.where('equipment').equals(equipment);
  }

  let [exerciseCount, exercises] = await Promise.all([
    Exercises.find().merge(exercisesQuery).countDocuments(),
    exercisesQuery.skip(skip).limit(limit).exec(),
  ]);

  if (q) {
    exercises = exercises.filter((item) => {
      return (
        item.target.includes(q) ||
        item.bodyPart.includes(q) ||
        item.equipment.includes(q)
      );
    });
  }

  const paginationData = calculatePaginationData(exerciseCount, perPage, page);

  return {
    data: exercises,
    ...paginationData,
  };
};

export default { getAll };
