import { User } from '../models/users.js';
import HttpError from '../helpers/httpError.js';
import { Exercises } from '../models/exercises.js';

const current = async (id) => {
  return await User.findById(id);
};

const updateUser = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true });

  if (!user) throw HttpError(404, 'User not found');

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) throw HttpError(404, 'User not found');

  return user;
};

const toggleFavorites = async (userId, exerciseId) => {
  const user = await User.findById(userId);
  if (!user) throw HttpError(404, 'User not found');

  const exercise = await Exercises.findById(exerciseId);
  if (!exercise) throw HttpError(404, 'Exercise not found');

  let favorites = user.favoriteExercises;

  let newExercise = {
    id: exerciseId,
    name: exercise.name,
    bodyPart: exercise.bodyPart,
    equipment: exercise.equipment,
    gifUrl: exercise.gifUrl,
    target: exercise.target,
    description: exercise.description,
    rating: exercise.rating,
    burnedCalories: exercise.burnedCalories,
    time: exercise.time,
    popularity: exercise.popularity,
  };
  const isInclude = user.favoriteExercises.some((item) => {
    return item.id === exerciseId;
  });

  if (!isInclude) {
    favorites?.push(newExercise);
  } else {
    favorites = user.favoriteExercises.filter((item) => item.id !== exerciseId);
  }

  return await User.findByIdAndUpdate(
    userId,
    { favoriteExercises: favorites },
    { new: true },
  );
};
export default {
  current,
  updateUser,
  deleteUser,
  toggleFavorites,
};
