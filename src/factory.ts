import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import { Sequelize } from "sequelize";
import "express-async-errors";
import session from "express-session";

import { AppConfig } from "./config";
import api from "./controllers/api";
// import { verifyJWT } from "./middlewares/verifyToken";
// import { verifyUser } from "./functions/auth";
import pages from "./controllers/pages";
import { setModel } from "./Models/index";
import { HyDatabase } from "./@types/Models";
import { errorHandler, authMiddleware } from "./middlewares/error"
import createPassport from "./middlewares/createPassport";

export interface Context {
  app: e.Express;
  db: HyDatabase;
  sequelize: Sequelize;
};

export const createContext = (config: AppConfig): Context => {
  const app = e();
  app.use(e.static("src/public"));
  app.set("view engine", "html");

  app.use(cors());
  app.use(cookieParser());
  app.use(e.urlencoded({ extended: true }));
  app.use(e.json());
  app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
  }));
  const sequelize = new Sequelize(config.databaseUri, config.seqConfig);
  const db = setModel(sequelize);
  const passport = createPassport(db);
  app.use(passport.initialize());
  app.use(passport.session());
  // app.set("superSecret", config.secret);
  app.use("/", pages);
  api.use(authMiddleware);
  app.use("/api/v1", api);
  app.use(errorHandler);
  return {
    app,
    db,
    sequelize
  };
};
