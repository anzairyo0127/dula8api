import * as express from "express";

import { context, config } from "../app";
import * as auth from "../functions/auth";
import * as utils from "../utils";

const rooter = express.Router();
rooter.get("/", (req, res, next) => {
  const user = <string>req.app.locals.username;
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
  const [userData, isSuccess] = await auth.createNewUser(context.db, { username, password }, config.stretch);
  if (isSuccess) {
    return utils.sendPayload(res, 200, {
      message: `Create success Username:${userData.username}.`,
      userData: userData,
    });
  } else {
    return utils.sendPayload(res, 400, {
      message: `Create failed.`
    });
  };
});  
export default rooter;