import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const api = makeInvoker(AuthController);

router.post("/register", api("register"));
router.post("/login", api("login"));

export default router;
