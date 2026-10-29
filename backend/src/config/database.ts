import * as dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

export const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

database.on("error", (err: Error) => {
  console.error("Error inesperado en PostgreSQL:", err.message);
});
