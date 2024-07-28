import { Schema, model } from 'mongoose';

const users = new Schema(
  {
    email: {
      type: String,
      require: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      require: [true, 'Password is required'],
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = model('User', users);
