import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import { Sequelize } from "sequelize";
import "express-async-errors";

import { AppConfig } from "./config";
import createRoot from "./controllers/root";
import createAuthRoot from "./controllers/authentication";
import { createVerifyToken } from "./middlewares/verifyToken";
import { setModel } from "./Models/index";
import { HyDatabase } from "./@types/Models";
import { errorHandler } from "./middlewares/error"

export interface Context {
  app: e.Express;
  db: HyDatabase;
  sequelize: Sequelize;
};

export const createContext = (config: AppConfig): Context => {
  const app = e();
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.set("superSecret", config.secret);
  const sequelize = new Sequelize(config.databaseUri);
  const db = setModel(sequelize);
  const verifyToken = createVerifyToken(app.get("superSecret"));
  const root = createRoot([verifyToken]);
  const authRoot = createAuthRoot([], app.get("superSecret"));
  app.use("/auth", authRoot);
  app.use("/", root);
  app.use(errorHandler);
  return {
    app,
    db,
    sequelize
  };
};
