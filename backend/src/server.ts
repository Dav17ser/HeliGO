import operatorRouter from "./routes/operator.route";
import express from "express";
import { scopePerRequest } from "awilix-express";
import { container } from "./config/container";

export const createServer = () => {
  const app = express();

  app.use(express.json());

  app.use(scopePerRequest(container));

  app.use("/heligo/operators", operatorRouter);

  app.get("/heligo/health", (_req, res) => {
    res.status(200).json({
      message: "HeliGO API funcionando correctamente",
    });
  });

  return app;
};
