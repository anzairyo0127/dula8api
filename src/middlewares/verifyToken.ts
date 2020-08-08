import * as express from "express";
import jwt from "jsonwebtoken";

import * as auth from "../auth/auth";
import * as utils from "../utils";

export const createVerifyToken = (secret: string) => {
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
      req.user = <auth.AuthInfo>result["username"];
      next();
      return;
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
