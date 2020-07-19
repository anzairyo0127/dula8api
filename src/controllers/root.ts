import * as express from "express";

import { context } from "../app";
import { createUser } from "../auth/auth";
import * as utils from "../utils";

export default (middlewares: any[]) => {
  const rooter = express.Router();
  for (let m = 0; m < middlewares.length; m++) {
    rooter.use(middlewares[m]);
  };
  rooter.get("/", (req, res, next) => {
    utils.sendPayload(res, 200, {
      message: `Hello ${req.user.username}`
    });
    return;
  });
  rooter.post("/create_user", async (req, res, next) => {
    console.log(req)
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password")){
      utils.sendPayload(res, 400, {
        message: "Not enough data."
      });
      return;
    };
    const username = req.body["username"];
    const password = req.body["password"];
    const result = await createUser(context.db, { username, password });
    if (result.status === "ok") {
      utils.sendPayload(res, 200, {
        message: `Create success ${result.username}. --${result.message}`
      });
    } else {
      utils.sendPayload(res, 400, {
        message: `Create failed ${result.username}. --${result.message}`
      });
    }
    return;
  });  
  return rooter;
};
