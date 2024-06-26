import * as dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET;

export { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
