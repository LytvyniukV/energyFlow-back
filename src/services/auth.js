import { User } from '../models/users.js';
import HttpError from '../helpers/httpError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { createTokens } from '../middlewares/createSession.js';
import sendEmail from '../helpers/sendEmail.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../helpers/googleAuth.js';
import { Tokens } from '../models/tokens.js';
import {
  SECRET_ACCESS_TOKEN_KEY,
  SECRET_REFRESH_TOKEN_KEY,
} from '../constants/index.js';

const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw HttpError(409);

  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verifyToken = crypto.randomUUID();

  const newUser = await User.create({
    email: payload.email,
    password: hashPassword,
    verificationToken: verifyToken,
  });

  await Tokens.deleteOne({ user: newUser._id });
  const { accessToken, refreshToken } = await createTokens(newUser._id);
  await Tokens.create({ user: newUser._id, refreshToken: refreshToken });
  // await sendEmail.sendMailVerify(payload.email, verifyToken);

  return { email: newUser.email, accessToken, refreshToken };
};

const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw HttpError(404, 'User not found');
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw HttpError(401);
  // if (!user.verify) throw HttpError(401, 'Please, verify your email');
  await Tokens.deleteOne({ user: user._id });

  const { accessToken, refreshToken } = await createTokens(user._id);

  await Tokens.create({ user: user._id, refreshToken });

  return { accessToken, refreshToken };
};

const logout = async (refreshToken) => {
  await Tokens.deleteOne({ refreshToken: refreshToken });
};

const refreshUsersSession = async (token) => {
  if (!token) throw HttpError(401);

  const userData = jwt.verify(token, SECRET_REFRESH_TOKEN_KEY);

  const tokenData = await Tokens.findOne({ refreshToken: token });

  if (!userData || !tokenData) throw HttpError(401);

  const user = await User.findById(userData.id);
  const { accessToken, refreshToken } = await createTokens(userData.id);

  await Tokens.findOneAndUpdate({ user: userData.id }, { refreshToken });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const resetTokenByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    SECRET_KEY,
    {
      expiresIn: '15m',
    },
  );

  await sendEmail.sendMailResetPassword(email, resetToken);
};

const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, SECRET_ACCESS_TOKEN_KEY);
  } catch (err) {
    if (err instanceof Error) throw HttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
};

const verifyEmail = async (token) => {
  const user = await User.findOneAndUpdate(
    { verificationToken: token },
    { verify: true, verificationToken: null },
    { new: true },
  );

  if (!user) throw HttpError(404, 'User not found');

  return user;
};

const extraVerifyEmail = async (email) => {
  const user = await User.findOne(email);
  if (!user) throw HttpError(404, 'User not found');
  if (user.verify) throw HttpError(400, 'Verification has already been passed');
  return await sendEmail.sendMailVerify(email, user.verificationToken);
};

const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw HttpError(401);

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash('10', 10);
    user = await User.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      verificationToken: null,
      verify: true,
    });
  }
  await Tokens.deleteOne({ user: user._id });
  const { accessToken, refreshToken } = await createTokens(user._id);

  await Tokens.create({ user: user._id, refreshToken });

  return { accessToken, refreshToken };
};

export default {
  registerUser,
  loginUser,
  logout,
  refreshUsersSession,
  resetTokenByEmail,
  verifyEmail,
  extraVerifyEmail,
  resetPassword,
  loginOrSignupWithGoogle,
};
