import e from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import postsRouter from "./controllers/posts";

export const createApp = () =>{
  const app = e();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use("/", postsRouter);
  return app;
};
