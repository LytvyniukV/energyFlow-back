import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const uriDb = process.env.DB_HOST;
export const SECRET_KEY = process.env.SECRET_KEY;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
