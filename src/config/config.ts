const dotenv = require('dotenv');
dotenv.config();

export const PAYPAL_API = process.env.PAYPAL_URL || 'https://api-m.sandbox.paypal.com';
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
export const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY!;