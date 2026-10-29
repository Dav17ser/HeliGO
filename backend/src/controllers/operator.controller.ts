import { Request, Response, NextFunction } from "express";
import { OperatorService } from "../services/operator.service";

export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const operators = await this.operatorService.getAll();
      res.status(200).json(operators);
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
        message: "El identificador del operador no es válido",
      });
      return;
    }


    try {
      const operator = await this.operatorService.getById(id);

      if (!operator) {
        res.status(404).json({
          message: "Operador no encontrado",
        });
        return;
      }

      res.status(200).json(operator);
    } catch (error) {
      next(error);
    }
  }
}
