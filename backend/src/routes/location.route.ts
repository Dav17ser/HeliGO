import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { LocationController } from "../controllers/location.controller";

const router = Router();
const api = makeInvoker(LocationController);

// Consultar destinos disponibles.
router.get("/destinations", api("getAllActiveDestinations"));

// Consultar ubicaciones de un operador específico.
router.get("/operator/:operatorId", api("getByOperatorId"));

export default router;
