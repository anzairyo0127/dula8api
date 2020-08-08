import * as express from "express";

import { context, config } from "../app";
import * as auth from "../auth/auth";
import * as utils from "../utils";

export default (middlewares: any[]) => {
  const rooter = express.Router();
  for (let m = 0; m < middlewares.length; m++) {
    rooter.use(middlewares[m]);
  };
  rooter.get("/", (req, res, next) => {
    const user = <string>req.user;
    return utils.sendPayload(res, 200, 
      { message: `Hello ${user}`}
    );
  });
  rooter.post("/create_user", async (req, res, next) => {
    console.log(req)
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password")){
      return utils.sendPayload(res, 400,
        { message: "Not enough data."}
      );
    };
    const [username, password] = [req.body["username"], req.body["password"]];
    const result = await auth.createNewUser(context.db, { username, password }, config.stretch);
    if (result.status === "ok") {
      return utils.sendPayload(res, 200, {
        message: `Create success ${result.username}. --${result.message}`
      });
    } else {
      return utils.sendPayload(res, 400, {
        message: `Create failed ${result.username}. --${result.message}`
      });
    };
  });  
  return rooter;
};
