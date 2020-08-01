import bcrypto from "bcrypt";
import { Pool } from "pg";

import { init } from "./initAuth";
import * as auth from "../../src/auth/auth";

/**
 * @param pool; postgresのPool
 * @param dbUri; 環境変数DATABASE_URLはpg-testのPG用URIで自動で挿入される
 * @param table; pgのテーブル名
 */
let pool: Pool;
const saltRound = 2;
const dbUri = process.env.DATABASE_URL; 
const table = "users";

describe("auth/auth.ts test.", () => {
  beforeAll(async () => {
    pool = new Pool({ connectionString: dbUri });
    await init(pool, saltRound);
  });

  afterAll(async () => {
    await pool.query(`DROP TABLE ${table}`);
    await pool.end();
  });

  describe("verifyIdAndUsername(db, authInfo)", () => {
    test("When the correct user info, return true.", async () => {
      const correctUser = {
        id: "1",
        username: "appps",
      };
      const result = await auth.verifyIdAndUsername(pool, correctUser);
      expect(result).toBeTruthy();
    });

    test("When the incorrect user info, return false.", async () => {
      const incorrectUser = {
        id: "2",
        username: "appps",
      };
      const result = await auth.verifyIdAndUsername(pool, incorrectUser);
      expect(result).toBeFalsy();
    });
  });

  describe("verifyUser(db, authInfo)", () => {
    test("When the correct user info, return userdata.", async () => {
      const correctUser = {
        username: "appps",
        password: "test",
      };
      const result = await auth.verifyUser(pool, correctUser);
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
      const result = await auth.verifyUser(pool, incorrectUser);
      expect(result).toEqual({});
    });
  });

  describe("createNewUser(db, authInfo)", () => {
    test("正しいユーザーデータを引数に渡したとき、データベースにユーザーを追加し、成功したステータスを返却します。", async () => {
      const correctNewUser = {
        username: "ichitaro",
        password: "test",
      };
      const result = await auth.createNewUser(pool, correctNewUser, saltRound);
      expect(result).toEqual({
        status: "ok",
        message: "1",
        username: correctNewUser.username,
      });
      // DB内に追加したユーザーがいるか確認。
      const searchNewUserQuery = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [correctNewUser.username]
      };
      const users = await pool.query(searchNewUserQuery);
      const newUser = users.rows[0];
      expect(users.rowCount).toBe(1);
      expect(newUser.username).toBe(correctNewUser.username);
      expect(bcrypto.compareSync(correctNewUser.password, newUser.password)).toBeTruthy()
    });
    test("すでに存在するユーザーのデータを引数に渡した時、データベースへのアクセスを停止し、追加に失敗したステータスを返却します。", async () => {
      const incorrectNewUser = {
        username: "appps",
        password: "piyo",
      };
      const result = await auth.createNewUser(pool, incorrectNewUser, saltRound);
      expect(result).toEqual({
        status: "ng",
        message: "USERNAME:\"appps\" is already in use.",
        username: incorrectNewUser.username,
      });
    });
  });
});
