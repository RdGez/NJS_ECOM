import { Router } from "express";
import validateJwt from "../auth/utils/middlewares/validate.jwt";
import { createOrder, getOrders, getOrdersByUser, updateOrder } from "./orders.controller";
import { hasRole } from "../../shared/validators/validate.role";
import { ValidRoles } from "../../shared/interfaces/validRoles.enum";

const router = Router();

// Orders Routes:
router.get('/all', [ validateJwt, hasRole(ValidRoles.ADMIN_ROLE) ], getOrders);
router.get('/', validateJwt, getOrdersByUser);
router.post('/', validateJwt, createOrder);
router.post('/:id', validateJwt, updateOrder);

export default router;