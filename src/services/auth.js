import { User } from '../models/users.js';
import HttpError from '../helpers/httpError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FIFTEEN_MINUTES, ONE_DAY, SECRET_KEY } from '../constants/index.js';
import { Sessions } from '../models/session.js';
import { createSession } from '../middlewares/createSession.js';
import sendEmail from '../helpers/sendEmail.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../helpers/googleAuth.js';

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

  await sendEmail.sendMailVerify(payload.email, verifyToken);

  const accessToken = jwt.sign({ id: newUser._id }, SECRET_KEY, {
    expiresIn: '3h',
  });
  const refreshToken = jwt.sign({ id: newUser._id }, SECRET_KEY, {
    expiresIn: '5h',
  });
  await Sessions.create({
    userId: newUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
  return { email: newUser.email, accessToken };
};

const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw HttpError(404, 'User not found');
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw HttpError(401);
  if (!user.verify) throw HttpError(401, 'Please, verify your email');
  await Sessions.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: '3h',
  });
  const refreshToken = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: '5h',
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

const resetTokenByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
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
    entries = jwt.verify(payload.token, SECRET_KEY);
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

  const newSession = await createSession(user._id);

  return await Sessions.create({
    userId: user._id,
    ...newSession,
  });
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
