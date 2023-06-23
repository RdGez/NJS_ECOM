import { Router } from "express";
import { renewToken, signIn, signUp } from "./auth.controller";
import validateJwt from "./utils/middlewares/validate.jwt";

const router = Router();

// Authentication User's Routes:
router.post('/', signIn);
router.post('/signup', signUp);
router.post('/renew', validateJwt, renewToken);

export default router;