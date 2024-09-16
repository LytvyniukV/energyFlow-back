import { calculatePaginationData } from '../helpers/calculatePaginationData.js';
import { countRating } from '../helpers/countRating.js';
import HttpError from '../helpers/httpError.js';
import { Exercises } from '../models/exercises.js';
import { Reviews } from '../models/reviews.js';
import { User } from '../models/users.js';
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
        item.target.startsWith(q) ||
        item.bodyPart.startsWith(q) ||
        item.equipment.startsWith(q)
      );
    });
  }
  if (!exercises) throw HttpError(404, 'Exercises not found');

  const paginationData = calculatePaginationData(exerciseCount, perPage, page);

  return {
    data: exercises,
    ...paginationData,
  };
};

const getById = async (id) => {
  const exercise = await Exercises.findById(id);
  const reviews = await Reviews.findOne({ exerciseId: id });
  if (!exercise) throw HttpError(404, 'Exercise not found');

  return { exercise, reviews };
};

const leaveReview = async (userId, exerciseId, userReview) => {
  const user = await User.findById(userId);
  console.log(user);
  const review = await Reviews.create({
    exerciseId,
    userName: user.name,
    userAvatar: user.avatarURL,
    ...userReview,
  });
  const exerciseReviews = await Reviews.find({ exerciseId });
  const ratingData = countRating(exerciseReviews);
  const exercise = await Exercises.findByIdAndUpdate(
    exerciseId,
    {
      rating: ratingData.rating,
      reviews: ratingData.totalReviews,
    },
    { new: true },
  );

  if (!user || !exercise) throw HttpError(404);
  return {
    review: exerciseReviews,
    exercise,
  };
};

const getReviews = async (exerciseId, queryParams) => {
  const { page = 1, perPage = 10 } = queryParams;
  const options = {
    page: page,
    limit: perPage,
    customLabels: {
      docs: 'data',
    },
  };
  const reviews = (await Reviews.paginate({ exerciseId }, options)) || [];

  return reviews;
};
export default { getAll, getById, leaveReview, getReviews };
