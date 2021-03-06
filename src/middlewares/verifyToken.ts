import * as express from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

import * as utils from "../utils";
import secretJson from "../../secret.json";

export const verifyJWT = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const jwks = req.headers["authorization"];
  if (!jwks) return utils.sendPayload(res, 401, { message: "Not Authenticate." });
  try {
    const token = jwt.decode(jwks, { complete: true });
    const secret = (secretJson.keys.filter(j => j.kid === token["header"]["kid"]))[0];
    const publicKey = jwkToPem({ e: secret.e, kty: <"RSA">secret.kty, n: secret.n });
    const result = <object>jwt.verify(jwks, publicKey, { algorithms: ['RS256'] });
    // console.log(result);
    req.app.locals.username = result["username"];
    req.app.locals.userid = result["sub"];
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
};
