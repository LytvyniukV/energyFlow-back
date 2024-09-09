import { Schema, model, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const schema = new Schema(
  {
    exerciseId: { type: Types.ObjectId, required: true },
    userName: { type: String },
    userAvatar: { type: String },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true },
);

schema.plugin(paginate);
export const Reviews = model('reviews', schema);
