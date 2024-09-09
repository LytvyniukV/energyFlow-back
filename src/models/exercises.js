import { Schema, model } from 'mongoose';

const exercises = new Schema(
  {
    bodyPart: { type: String },
    equipment: { type: String },
    gifUrl: { type: String },
    name: { type: String },
    target: { type: String },
    description: { type: String },
    rating: { type: Number },
    burnedCalories: { type: Number },
    time: { type: Number },
    popularity: { type: Number },
    reviews: { type: Number },
  },
  { versionKey: false },
);

export const Exercises = model('Exercise', exercises);
