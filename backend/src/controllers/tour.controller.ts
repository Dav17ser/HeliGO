import { Request, Response, NextFunction } from "express";
import { TourService } from "../services/tour.service";

export class TourController {
  constructor(private tourService: TourService) {}

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tours = await this.tourService.getAllActive();
      res.status(200).json(tours);
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const rawId = String(req.params.id);
    const id = Number(rawId);

    if (
      !/^[1-9]\d*$/.test(rawId) ||
      !Number.isSafeInteger(id)
    ) {
      res.status(400).json({
        message: "El identificador del tour no es válido",
      });
      return;
    }

    try {
      const tour = await this.tourService.getById(id);

      if (!tour) {
        res.status(404).json({
          message: "Tour no encontrado",
        });
        return;
      }

      res.status(200).json(tour);
    } catch (error) {
      next(error);
    }
  }
}
