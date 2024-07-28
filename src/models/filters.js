import { Schema, model } from 'mongoose';

const filters = new Schema({
  name: { type: String },
  filter: { type: String },
  imgUrl: { type: String },
});

export const Filter = model('Filter', filters);
