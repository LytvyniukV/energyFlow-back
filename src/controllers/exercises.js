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
    data: { exercise: exercise.exercise, reviews: exercise.reviews },
  });
};

const leaveReview = async (req, res) => {
  const review = await services.leaveReview(
    req.user._id,
    req.params.id,
    req.body,
  );

  res.status(201).json({
    message: 'Review created',
    data: { exercise: review.exercise, reviews: review.review },
  });
};

const getReviews = async (req, res) => {
  const reviews = await services.getReviews(req.params.id, req.query);
  res.status(200).json({
    message: 'Success',
    data: reviews,
  });
};
export default { getAll, getById, leaveReview, getReviews };
