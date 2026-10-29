import { Request, Response, NextFunction } from "express";
import { ServiceLocationService } from "../services/location.service";

export class LocationController {
  constructor(
    private serviceLocationService: ServiceLocationService
  ) {}

  async getByOperatorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const rawOperatorId = String(req.params.operatorId);
    const operatorId = Number(rawOperatorId);

    if (
      !/^[1-9]\d*$/.test(rawOperatorId) ||
      !Number.isSafeInteger(operatorId)
    ) {
      res.status(400).json({
        message: "El identificador del operador no es válido",
      });
      return;
    }

    try {
      const locations =
        await this.serviceLocationService.getByOperatorId(
          operatorId
        );

      res.status(200).json(locations);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "OPERADOR_NO_ENCONTRADO"
      ) {
        res.status(404).json({
          message: "Operador no encontrado",
        });
        return;
      }

      next(error);
    }
  }

  async getAllActiveDestinations(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const destinations =
        await this.serviceLocationService.getAllActiveDestinations();

      res.status(200).json(destinations);
    } catch (error) {
      next(error);
    }
  }
}
