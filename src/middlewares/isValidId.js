import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/httpError.js';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw HttpError(400, 'Bad Request');
  }

  next();
};
