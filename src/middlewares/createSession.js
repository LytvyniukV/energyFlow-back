import jwt from 'jsonwebtoken';
import {
  FIFTEEN_MINUTES,
  ONE_MONTH,
  SECRET_ACCESS_TOKEN_KEY,
  SECRET_REFRESH_TOKEN_KEY,
} from '../constants/index.js';

export const createTokens = async (userId) => {
  const accessToken = jwt.sign({ id: userId }, SECRET_ACCESS_TOKEN_KEY, {
    expiresIn: FIFTEEN_MINUTES,
  });
  const refreshToken = jwt.sign({ id: userId }, SECRET_REFRESH_TOKEN_KEY, {
    expiresIn: ONE_MONTH,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const setupCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
};
