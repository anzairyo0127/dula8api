import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import { Pool } from "pg";

import { AppConfig } from "./config";
import createRoot from "./controllers/root";
import createAuthRoot from "./controllers/authentication";
import { createVerifyToken } from "./middlewares/verifyToken";

interface Context {
  app: e.Express;
  db: Pool;
};

export const createContext = (config: AppConfig): Context => {
  const app = e();
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.set("superSecret", config.secret);
  const db = new Pool({ connectionString: config.databaseUri });
  const verifyToken = createVerifyToken(app.get("superSecret"), db);
  const root = createRoot([verifyToken]);
  const authRoot = createAuthRoot([], app.get("superSecret"));
  app.use("/auth", authRoot);
  app.use("/", root);
  return {
    app,
    db
  };
};
