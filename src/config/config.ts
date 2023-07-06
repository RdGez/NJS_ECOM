const dotenv = require('dotenv');
dotenv.config();

export const HOST = process.env.HOST || 'http://localhost:3000/api';
export const PAYPAL_API = process.env.PAYPAL_URL || 'https://api-m.sandbox.paypal.com';
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
export const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY!;
export const auth = { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET_KEY };