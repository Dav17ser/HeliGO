import { Request, Response } from "express";
import { OperatorService } from "../services/operator.service";

export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  getAll(_req: Request, res: Response): void {
    res.status(200).json(this.operatorService.getAll());
  }

  getById(req: Request, res: Response): void {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: "El identificador del operador no es válido",
      });
      return;
    }

    const operator = this.operatorService.getById(id);

    if (!operator) {
      res.status(404).json({
        message: "Operador no encontrado",
      });
      return;
    }

    res.status(200).json(operator);
  }
}
