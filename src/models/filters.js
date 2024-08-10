import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const filters = new Schema({
  name: { type: String },
  filter: { type: String },
  imgUrl: { type: String },
});

filters.plugin(paginate);

export const Filter = model('Filter', filters);
