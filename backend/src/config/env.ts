import * as dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  appName: "heligo-api",
  appVersion: "1.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
};