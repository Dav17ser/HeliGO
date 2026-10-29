import { asClass, createContainer, InjectionMode } from "awilix";

import { HealthService } from "../services/health.service";

import { OperatorService } from "../services/operator.service";
import { OperatorController } from "../controllers/operator.controller";
import { OperatorRepository } from "../repositories/operator.repository";

import { ServiceLocationRepository } from "../repositories/service-location.repository";
import { ServiceLocationService } from "../services/location.service";
import { LocationController } from "../controllers/location.controller";

import { TourRepository } from "../repositories/tour.repository";
import { TourService } from "../services/tour.service";

import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  healthService: asClass(HealthService).singleton(),

  operatorRepository: asClass(OperatorRepository).singleton(),
  operatorService: asClass(OperatorService).singleton(),
  operatorController: asClass(OperatorController).scoped(),

  serviceLocationRepository: asClass(ServiceLocationRepository).singleton(),
  serviceLocationService: asClass(ServiceLocationService).singleton(),
  locationController: asClass(LocationController).scoped(),

  tourRepository: asClass(TourRepository).singleton(),
  tourService: asClass(TourService).singleton(),

  authRepository: asClass(AuthRepository).singleton(),
  authService: asClass(AuthService).singleton(),
  authController: asClass(AuthController).scoped(),
});
