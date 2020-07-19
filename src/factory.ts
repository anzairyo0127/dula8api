import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import { Pool } from "pg";

import * as conf from "./config";
import createRoot from "./controllers/root";
import createAuthRoot from "./controllers/authentication";
import { createVerifyToken } from "./auth/auth";

interface Context {
  app: e.Express;
  db: Pool;
  port: string;
};

export const createContext = (mode: conf.Mode): Context => {
  const config = conf.appConfig(mode);
  const app = e();
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.set("superSecret", config.secret);
  const db = new Pool({ connectionString: config.databaseUri });
  const verifyToken = createVerifyToken(app.get("superSecret"));
  const root = createRoot([verifyToken]);
  const authRoot = createAuthRoot([], app.get("superSecret"));
  app.use("/auth", authRoot);
  app.use("/", root);
  return {
    app,
    db,
    port: config.port,
  };
};
