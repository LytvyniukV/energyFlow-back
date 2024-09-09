import express from 'express';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/exercises.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../helpers/validateBody.js';
import { reviewSchema } from '../schemas/reviews.js';
const router = express.Router();

router.get('/', wrapper(controller.getAll));
router.get('/:id', isValidId, wrapper(controller.getById));
router.post(
  '/reviews/:id',
  isValidId,
  validateBody(reviewSchema),
  wrapper(controller.leaveReview),
);
router.get('/reviews/:id', isValidId, wrapper(controller.getReviews));
export default router;
