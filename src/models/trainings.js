import { Schema, model, Types } from 'mongoose';
import { startDate, unixDay } from '../constants/index.js';

const schema = new Schema(
  {
    date: {
      type: Number,
      min: +startDate,
      validate: {
        validator: function (value) {
          return value <= Date.now() + unixDay;
        },
        message: 'Select a date that does not exceed today!',
      },
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    muscles: {
      type: String,
      required: true,
    },
    burnedCalories: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Training = model('Training', schema);
