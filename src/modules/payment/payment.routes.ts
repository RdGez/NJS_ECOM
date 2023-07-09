import { Router } from "express";
import { cancelOrder, captureOrder, createPaymentOrder } from "../payment/paypal.controller";
import validateJwt from "../auth/utils/middlewares/validate.jwt";

const router = Router();

// Payment Routes:
router.get('/create-order', validateJwt, createPaymentOrder);
router.get('/capture-order', captureOrder);
router.get('/capture-order', cancelOrder);

export default router;
