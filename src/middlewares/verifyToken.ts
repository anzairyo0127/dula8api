import * as express from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

import * as utils from "../utils";
import secretJson from "../../secret.json";
import { HyDatabase } from "../@types/Models";
// import { findUserIdByCognitoSub } from "../functions/auth";
import { getFollowers } from "../functions/follow"

export const verifyJWT = (db: HyDatabase) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(req.headers);
    const jwks = <string>req.headers.authorization;
    console.log(jwks);
    if (!jwks) return utils.sendPayload(res, 401, { message: "Not Authenticate." });
    try {
      const token = jwt.decode(jwks, { complete: true });
      const secret = (secretJson.keys.filter(j => j.kid === token["header"]["kid"]))[0];
      const publicKey = jwkToPem({ e: secret.e, kty: <"RSA">secret.kty, n: secret.n });
      const result = <object>jwt.verify(jwks, publicKey, { algorithms: ['RS256'] });
      res.locals.username = result["username"];
      res.locals.cognitoSub = result["sub"];
      // const [id, success] = await findUserIdByCognitoSub(db, res.locals.cognitoSub );
      // res.locals.id = id;  
      const [followUsers, isSuccess] =  await getFollowers(db, res.locals.id);
      res.locals.followUsers = followUsers;  
      next();
    } catch (e) {
      switch (e.name) {
        case "TokenExpiredError":
          return utils.sendPayload(res, 401, { message: "Token Expired" });
        default:
          throw e;
      };
    };
    return;
  }
};
