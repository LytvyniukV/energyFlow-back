import { User } from '../models/users.js';
import HttpError from '../helpers/httpError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants/index.js';

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

  const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: '3h',
  });

  return await User.findByIdAndUpdate(user._id, { accessToken }, { new: true });
};

const logout = async (id) => {
  return await User.findByIdAndUpdate(id, { accessToken: null }, { new: true });
};
export default { registerUser, loginUser, logout };
