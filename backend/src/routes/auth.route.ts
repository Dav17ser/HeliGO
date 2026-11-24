import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
const api = makeInvoker(AuthController);

router.post("/register", api("register"));
router.post("/login", api("login"));
router.post("/forgot-password", api("forgotPassword"));

// Ruta de verificación del middleware requireAuth: devuelve la identidad
// obtenida del token. No toca base de datos ni lógica de negocio.
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
