import * as express from "express";
import bcrypto from "bcrypt";
import { Pool, QueryConfig } from "pg";
import jwt from "jsonwebtoken";

import * as utils from "../utils";
import { context } from "../app";

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
      const authInfo = {
        id: result["id"],
        username: result["username"],
      };
      if (await verifyIdAndUsername(context.db, authInfo)) {
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

export interface AuthInfomation {
  id?: string;
  username?: string;
}

export const verifyIdAndUsername = async (
  db: Pool,
  authInfo: AuthInfomation
): Promise<Boolean> => {
  const query: QueryConfig = {
    text: "SELECT id,username FROM users WHERE id=$1 AND username=$2",
    values: [String(authInfo.id), authInfo.username],
  };
  const result = await db.query(query);
  return !!result.rowCount;
};

export interface AuthInfomationByForm {
  username: string;
  password: string;
}

export const verifyUser = async (
  db: Pool,
  authInfo: AuthInfomationByForm
): Promise<AuthInfomation> => {
  const query: QueryConfig = {
    text: "SELECT id,username,password FROM users WHERE username=$1",
    values: [authInfo.username],
  };
  const result = await db.query(query);
  if (!result.rowCount) return {};
  if (!bcrypto.compareSync(authInfo.password, result.rows[0].password)) {
    return {};
  } else {
    return { id: result.rows[0].id, username: result.rows[0].username };
  }
};

export const createUser = async (
  db: Pool,
  authInfo: AuthInfomationByForm
): Promise<any> => {
  try {
    await db.query("BEGIN");
    const query: QueryConfig = {
      text: "SELECT username FROM users WHERE username=$1",
      values: [authInfo.username],
    };
    const result = await db.query(query);
    console.log(result);
    if (result.rowCount) {
      // すでにユーザー名が存在する場合
      throw new Error(`USERNAME:"${authInfo.username}" is already in use.`);
    } else {
      const saltRound = 10;
      const salt = bcrypto.genSaltSync(saltRound);
      const insertQuery: QueryConfig = {
        text: "INSERT INTO users (username, password) VALUES ($1, $2);",
        values: [authInfo.username, bcrypto.hashSync(authInfo.password, salt)],
      };
      const result = await db.query(insertQuery);
      console.log(result);
      await db.query("COMMIT");
      return { status: "ok", message: `${result.rowCount}`, username: authInfo.username,};
    }
  } catch (e) {
    await db.query("ROLLBACK");
    console.log(e);
    return { status: "ng", message: e.message, username: authInfo.username };
  }
};
