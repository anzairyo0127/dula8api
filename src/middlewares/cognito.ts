import CognitoExpress from "cognito-express";
import { Request, Response, NextFunction } from "express";

import * as utils from "../utils";

const cognitoMiddlewares = (region: string, userPoolId: string) => {
  const cognito = new CognitoExpress({
    region,
    cognitoUserPoolId: userPoolId,
    tokenUse: "access", //Possible Values: access | id
    tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
  });

  const cognitoAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = <string>req.headers.authorization;
    if (!accessToken) { utils.sendPayload(res, 401, { message: "Token Expired" }); return; }
    cognito.validate(accessToken, (err: any, response: any) => {
      if (err) { utils.sendPayload(res, 401, { message: "Token Expired" }); return; }
      console.log(response);
      res.locals.user = response;
      next();
      return;
    });
  };
  return cognitoAuthenticate;
};

export default cognitoMiddlewares;
