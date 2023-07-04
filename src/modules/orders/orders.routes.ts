import { Router } from "express";
import validateJwt from "../auth/utils/middlewares/validate.jwt";
import { createOrder, getOrders, getOrdersByUser } from "./orders.controller";
import { hasRole } from "../../shared/validators/validate.role";
import { ValidRoles } from "../../shared/interfaces/validRoles.enum";

const router = Router();

// Orders Routes:
router.get('/', validateJwt, getOrdersByUser);
router.get('/all', [ validateJwt, hasRole(ValidRoles.ADMIN_ROLE) ], getOrders);
router.post('/', validateJwt, createOrder);

export default router;