import * as express from "express";
import jwt from "jsonwebtoken";

import * as auth from "../auth/auth";
import * as utils from "../utils";
import { Pool } from "pg";

export const createVerifyToken = (secret: string, db:Pool ) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const token = req.headers["authorization"];
    if (!token)
      return utils.sendPayload(res, 401, { message: "Not Authenticate." });
    try {
      const result = <object>jwt.verify(token, secret);
      const authInfo = {
        id: result["id"],
        username: result["username"],
      };
      if (await auth.verifyIdAndUsername(db, authInfo)) {
        req.user = <auth.AuthInfomation>authInfo;
        next();
        return;
      } else {
        utils.sendPayload(res, 403, {
          message:
            "The user name does not exist or the password does not match.",
        });
        return;
      }
    } catch (e) {
      switch (e.name) {
        case "TokenExpiredError":
          return utils.sendPayload(res, 400, {
            message: "Invalid or Expired Token.",
          });
        default:
          console.log(e);
          return utils.sendPayload(res, 401, { message: `Error.${e.name}` });
      }
    }
  };
};
