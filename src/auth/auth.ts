import bcrypto from "bcrypt";
import { HyDatabase } from "../@types/Models";

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
): Promise<UserInfo> => {
  const user = await db.users.findOne({
    attributes: ["id", "username", "password"],
    where: { username: authInfo.username },
  });
  if (user && bcrypto.compareSync(authInfo.password, user.password)) {
    return { id: user.id, username: user.username };
  } else {
    return { id: null, username: null };
  }
};

export const createNewUser = async (
  db: HyDatabase,
  authInfo: AuthInfo,
  saltRound: number
): Promise<any> => {
  const [result, isSuccess] = await db.users.findOrCreate({
    where: {
      username: authInfo.username,
    },
    defaults: {
      password: bcrypto.hashSync(authInfo.password, bcrypto.genSaltSync(saltRound)),
    },
  });
  if (!isSuccess) {
    return {
      status: "ng",
      message: "faild to create user",
      username: authInfo.username,
    };
  } else {
    return {
      status: "ok",
      message: "success to create user",
      username: authInfo.username,
    };
  }
};
