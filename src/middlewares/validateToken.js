import HttpError from '../helpers/httpError.js';
import { User } from '../models/users.js';
import { Sessions } from '../models/session.js';

export const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw HttpError(401);

  const [bearer, token] = authHeader.split(' ', 2);
  if (bearer !== 'Bearer') throw HttpError(401);

  const session = await Sessions.findOne({ accessToken: token });

  if (!session) {
    next(HttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(HttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;

  next();
};
