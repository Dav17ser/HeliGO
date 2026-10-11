
import { asClass, createContainer, InjectionMode } from "awilix";
import { HealthService } from "../services/health.service";
import { OperatorService } from "../services/operator.service";
import { OperatorController } from "../controllers/operator.controller";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  healthService: asClass(HealthService).singleton(),
  operatorService: asClass(OperatorService).singleton(),
  operatorController: asClass(OperatorController).scoped(),
});
