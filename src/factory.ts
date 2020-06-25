import e from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { Pool } from "pg";

import * as conf from "./config";
import root from "./controllers/root";

interface Context {
  app: e.Express,
  db: Pool,
  port: string
};

export const createContext :(mode: conf.Mode) => Context = (mode) => {
  const config = conf.appConfig(mode);
  const app = e();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use("/", root);
  const db = new Pool({ connectionString: config.databaseUri });
  return {
    app,
    db,
    port: config.port
  };
};
