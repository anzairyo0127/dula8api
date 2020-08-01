import * as express from "express";

import { context, config } from "../app";
import { createNewUser, AuthInfomation } from "../auth/auth";
import * as utils from "../utils";

export default (middlewares: any[]) => {
  const rooter = express.Router();
  for (let m = 0; m < middlewares.length; m++) {
    rooter.use(middlewares[m]);
  };
  rooter.get("/", (req, res, next) => {
    const user:AuthInfomation = req.user;
    utils.sendPayload(res, 200, {
      message: `Hello ${user.username}`
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
    const [username, password] = [req.body["username"], req.body["password"]];
    const result = await createNewUser(context.db, { username, password }, config.stretch);
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
