import bcrypto from "bcrypt";
import { HyDatabase } from "../../src/@types/Models";

export const alreadyUser = {
  username: "appps",
  password: "test",
};

export const init = async (db: HyDatabase, saltRound:number): Promise<void> => {
  const salt = bcrypto.genSaltSync(saltRound);
  const user = await db.users.create({
    username: alreadyUser.username,
    password: bcrypto.hashSync(alreadyUser.password, salt),
  });
  await user.save();
  return;
};
