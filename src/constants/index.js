import dotenv from 'dotenv';

dotenv.config();

export const SERVER_HOST = process.env.SERVER_HOST;
export const PORT = process.env.PORT || 3000;
export const uriDb = process.env.DB_HOST;
export const SECRET_KEY = process.env.SECRET_KEY;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SEND_GRID_TOKEN = process.env.SEND_GRID_API_KEY;
export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_KEY,
  API_SECRET: process.env.CLOUDINARY_SECRET,
};
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
