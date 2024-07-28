import jwt from 'jsonwebtoken';
import HttpError from '../helpers/httpError.js';
import { User } from '../models/users.js';
import { SECRET_KEY } from '../constants/index.js';

export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw HttpError(401);

  const [bearer, token] = authHeader.split(' ', 2);
  if (bearer !== 'Bearer') throw HttpError(401);

  jwt.verify(token, SECRET_KEY, verifyCallback);

  async function verifyCallback(err, decode) {
    if (err) next(HttpError(401));

    try {
      const user = await User.findById(decode.id);
      if (!user || user.accessToken !== token) throw HttpError(401);

      req.user = {
        id: user._id,
        email: user.email,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
};
