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
    amount: {
      type: Number,
      min: 10,
      max: 2000,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Water = model('Water', schema);
