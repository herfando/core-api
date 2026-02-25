// authorsRoutes.ts
import { Router } from "express";
import { listAuthors } from "../controllers/authorsController";
const router = Router();
router.get("/", listAuthors);
export default router;