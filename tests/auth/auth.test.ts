import bcrypto from "bcrypt";

import { init, alreadyUser } from "./initAuth";
import * as auth from "../../src/auth/auth";
import { Sequelize } from "sequelize";
import { setModel } from "../../src/Models";
import { HyDatabase } from "../../src/@types/Models";

const saltRound = 2;
const dbUri = process.env.DATABASE_URL; 

const sequelize: Sequelize = new Sequelize(dbUri);
const db: HyDatabase = setModel(sequelize);

describe("auth/auth.ts test.", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await init(db, saltRound);
  });

  afterAll(async () => {
    await sequelize.drop();
  });

  describe("verifyUser(db, authInfo)", () => {
    test("When the correct user info, return userdata.", async () => {
      const correctUser = {
        username: "appps",
        password: "test",
      };
      const result = await auth.verifyUser(db, correctUser);
      expect(result).toEqual({
        id: 1,
        username: correctUser.username
      });
    });
    test("When the incorrect user info, return no data.", async () => {
      const incorrectUser = {
        username: "appps",
        password: "piyo",
      };
      const result = await auth.verifyUser(db, incorrectUser);
      expect(result).toEqual({id:null, username:null});
    });
  });

  describe("createNewUser(db, authInfo)", () => {
    test("正しいユーザーデータを引数に渡したとき、データベースにユーザーを追加し、成功したステータスを返却します。", async () => {
      const correctNewUser = {
        username: "ichitaro",
        password: "test",
      };
      const result = await auth.createNewUser(db, correctNewUser, saltRound);
      expect(result).toEqual({
        status: "ok",
        message: "success to create user",
        username: correctNewUser.username,
      });
      // DB内に追加したユーザーがいるか確認。
      const users = await db.users.findAll({
        where: {
          username: correctNewUser.username
        }
      });
      const newUser = users[0];
      expect(users.length).toBe(1);
      expect(newUser.username).toBe(correctNewUser.username);
      expect(bcrypto.compareSync(correctNewUser.password, newUser.password)).toBeTruthy()
    });
    test("すでに存在するユーザーのデータを引数に渡した時、データベースへのアクセスを停止し、追加に失敗したステータスを返却します。", async () => {
      const incorrectNewUser = {
        username: "appps",
        password: "piyo",
      };
      const result = await auth.createNewUser(db, incorrectNewUser, saltRound);
      expect(result).toEqual({
        status: "ng",
        message: "faild to create user",
        username: incorrectNewUser.username,
      });
      // DB内に追加したユーザーがいるか確認。
      const matchedUsers = await db.users.findAll({
        where: {
          username: incorrectNewUser.username
        }
      });
      const user = matchedUsers[0];
      expect(matchedUsers.length).toBe(1);
      expect(alreadyUser.username).toBe(user.username);
      expect(bcrypto.compareSync(alreadyUser.password, user.password)).toBeTruthy()
    });
  });
});
