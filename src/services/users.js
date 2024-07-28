import { User } from '../models/users.js';
import HttpError from '../helpers/httpError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FIFTEEN_MINUTES, ONE_DAY, SECRET_KEY } from '../constants/index.js';
import { Sessions } from '../models/session.js';
import { createSession } from '../middlewares/createSession.js';
const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw HttpError(409);

  const hashPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: hashPassword,
  });
};

const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw HttpError(404, 'User not found');
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw HttpError(401);

  await Sessions.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: '20m',
  });

  return await Sessions.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

const logout = async (sessionId) => {
  await Sessions.deleteOne({ _id: sessionId });
};

const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Sessions.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw HttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw HttpError(401, 'Session token expired');
  }

  const newSession = await createSession(sessionId);

  await Sessions.deleteOne({ _id: sessionId, refreshToken });

  return await Sessions.create({
    userId: session.userId,
    ...newSession,
  });
};

const current = async (token) => {
  return await User.findOne({ accessToken: token });
};
export default {
  registerUser,
  loginUser,
  logout,
  refreshUsersSession,
  current,
};
