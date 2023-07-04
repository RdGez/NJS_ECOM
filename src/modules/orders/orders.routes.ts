import { Router } from "express";
import validateJwt from "../auth/utils/middlewares/validate.jwt";
import { createOrder } from "./orders.controller";

const router = Router();

// Orders Routes:
// router.get('/', validateJwt, );
router.post('/', validateJwt, createOrder);

export default router;