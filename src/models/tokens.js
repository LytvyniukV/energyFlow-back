import { model, Schema, Types } from 'mongoose';

const tokens = new Schema(
  {
    user: { type: Types.ObjectId, required: true },
    refreshToken: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

export const Tokens = model('Tokens', tokens);
