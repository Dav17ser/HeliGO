import operatorRouter from "./routes/operator.route";
import locationRouter from "./routes/location.route";
import tourRouter from "./routes/tour.route";
import authRouter from "./routes/auth.route";

import express from "express";
import { scopePerRequest } from "awilix-express";
import { container } from "./config/container";

export const createServer = () => {
  const app = express();

  app.use(express.json());

  app.use(scopePerRequest(container));

  app.use("/heligo/operators", operatorRouter);
  app.use("/heligo/locations", locationRouter);
  app.use("/heligo/tours", tourRouter);
  app.use("/heligo/auth", authRouter);
  app.get("/heligo/health", (_req, res) => {
    res.status(200).json({
      message: "HeliGO API funcionando correctamente",
    });
  });

  app.use((_req, res) => {
    res.status(404).json({
      message: "Ruta no encontrada",
    });
  });
app.use(
    (
      error: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("Error interno de la API:", error);

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  );
  return app;
};
