import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { OperatorController } from "../controllers/operator.controller";

const router = Router();

const api = makeInvoker(OperatorController);

router.get("/", api("getAll"));
router.get("/:id", api("getById"));

export default router;
