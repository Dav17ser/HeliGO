import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { TourController } from "../controllers/tour.controller";

const router = Router();
const api = makeInvoker(TourController);

router.get("/", api("getAll"));
router.get("/:id", api("getById"));

export default router;
