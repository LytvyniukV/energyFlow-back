import {
  SECRET_ACCESS_TOKEN_KEY,
  SECRET_REFRESH_TOKEN_KEY,
} from '../constants/index.js';
import HttpError from '../helpers/httpError.js';
import { User } from '../models/users.js';
import jwt from 'jsonwebtoken';

export const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw HttpError(401);

  const [bearer, token] = authHeader.split(' ', 2);
  if (bearer !== 'Bearer' || !token) throw HttpError(401);

  const userData = jwt.verify(token, SECRET_ACCESS_TOKEN_KEY);

  const user = await User.findById(userData.id);

  if (!user) {
    next(HttpError(401));
    return;
  }

  req.user = user;

  next();
};

export const validateRefreshToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw HttpError(401);

  const [bearer, token] = authHeader.split(' ', 2);
  if (bearer !== 'Bearer' || !token) throw HttpError(401);

  const userData = jwt.verify(token, SECRET_REFRESH_TOKEN_KEY);

  const user = await User.findById(userData.id);

  if (!user || !userData) {
    next(HttpError(401));
    return;
  }

  req.user = user;

  next();
};
