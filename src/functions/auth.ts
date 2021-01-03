import bcrypto from "bcrypt";
import { HyDatabase } from "../@types/Models";
import * as I from "../interfaces";

export interface AuthInfo {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
}

export const verifyUser = async (
  db: HyDatabase,
  authInfo: AuthInfo
): Promise<[I.UserInfo, Boolean]> => {
  const user = await db.users.findOne({
    attributes: ["id", "username", "password"],
    where: { username: authInfo.username },
  });
  if (user && bcrypto.compareSync(authInfo.password, user.password)) {
    return [{ id: user.id, username: user.username }, true];
  } else {
    return [null, false];
  }
};

export const createNewUser = async (
  db: HyDatabase,
  authInfo: AuthInfo,
  saltRound: number
): Promise<[UserInfo, Boolean]> => {
  const [result, isSuccess] = await db.users.findOrCreate({
    where: {
      username: authInfo.username,
    },
    defaults: {
      password: bcrypto.hashSync(
        authInfo.password,
        bcrypto.genSaltSync(saltRound)
      ),
    },
  });
  if (!isSuccess) {
    return [null, false];
  } else {
    return [{ id: result.id, username: result.username }, true];
  }
};
