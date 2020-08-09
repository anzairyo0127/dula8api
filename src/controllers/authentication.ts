import * as express from "express";
import jwt from "jsonwebtoken";

import * as utils from "../utils";
import * as auth from "../auth/auth";
import { context } from "../app";

export default (middlewares: any[], secret: string) => {
  const authRooter = express.Router();
  for (let m = 0; m < middlewares.length; m++) {
    authRooter.use(middlewares[m]);
  }

  authRooter.post("/login", async (req, res, next) => {
    if (
      !req.body.hasOwnProperty("username") ||
      !req.body.hasOwnProperty("password")
    ) {
      return utils.sendPayload(res, 404);
    }
    const username = req.body["username"];
    const password = req.body["password"];
    const [data, isSuccess] = await auth.verifyUser(context.db, {
      username,
      password,
    });
    if (!isSuccess) {
      return utils.sendPayload(res, 401);
    } else {
      const token = jwt.sign(
        { id: data.id, username: data.username },
        secret,
        { algorithm: "HS256", expiresIn: "1h" }
      );
      return utils.sendPayload(res, 200, {
        message: "success",
        token,
      });
    };
  });

  return authRooter;
};
