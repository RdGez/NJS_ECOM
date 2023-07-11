import { Router } from "express";
import { cancelOrder, captureOrder, createPaymentOrder } from "../payment/paypal.controller";
import validateJwt from "../auth/utils/middlewares/validate.jwt";
import { createPreference, webHook } from "./mercado.controller";

const router = Router();

// Payment Routes:

// PayPal Method:
router.post('/create-order', validateJwt, createPaymentOrder);
router.get('/capture-order', captureOrder);
router.get('/capture-order', cancelOrder);

// MercadoPago Method:
router.post('/create-preference', validateJwt, createPreference);
router.get('/capture-payment', (req, res) => res.send('Capture Payment'));
router.get('/failure-payment', (req, res) => res.send('Failure Payment'));
router.get('/pending-payment', (req, res) => res.send('Pending Payment'));
router.get('/webhook-payment', webHook);

export default router;
