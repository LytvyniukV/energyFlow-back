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
    gender: {
      type: String,
      default: null,
      enum: ['male', 'female'],
    },
    name: {
      type: String,
      default: null,
    },
    activeTime: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    liters: {
      type: Number,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    favoriteExercises: {
      type: [String],
      default: [],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = model('User', users);
