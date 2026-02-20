import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// endpoint register
router.post("/register", register);

// endpoint login
router.post("/login", login);

export default router;