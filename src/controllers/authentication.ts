import * as express from "express";
import jwt from "jsonwebtoken";
import * as cognito from "amazon-cognito-identity-js";

import * as utils from "../utils";
import * as auth from "../functions/auth";
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
    const username = <string>req.body["username"];
    const password = <string>req.body["password"];

    const cognitoPool = new cognito.CognitoUserPool({
      UserPoolId:"ap-northeast-1_NjUIUzauc",
      ClientId: "3ibiv7915c7p900ig3i3is3kcm",
    });
    
    const cogUser = new cognito.CognitoUser({
      Username: username,
      Pool:cognitoPool,
    })
    const cogPass = new cognito.AuthenticationDetails({
      Username: username,
      Password: password
    })

    cogUser.authenticateUser(cogPass, {
      onSuccess: (result) => {
        return utils.sendPayload(res, 200, {
          message: "success",
          token: result.getAccessToken().getJwtToken(),
        });  
      },
      onFailure: (error) => {
        console.log(error)
        return utils.sendPayload(res, 401, {
          message: error
        });
      },
      newPasswordRequired(user_attributes, required_attributes) {
        cogUser.completeNewPasswordChallenge(password, user_attributes, this);
      }
    })
  });

  return authRooter;
};
