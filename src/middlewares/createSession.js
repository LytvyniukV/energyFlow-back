import jwt from 'jsonwebtoken';
import { FIFTEEN_MINUTES, ONE_DAY, SECRET_KEY } from '../constants/index.js';

export const createSession = async (userId) => {
  const accessToken = jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: '20m',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};
