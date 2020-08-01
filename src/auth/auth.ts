import bcrypto from "bcrypt";
import { Pool, QueryConfig } from "pg";

export interface AuthInfomation {
  id?: string;
  username?: string;
}

export interface AuthInfomationByForm {
  username: string;
  password: string;
}

/**
 * authInfoに記載されているidとusernameを元にそのユーザーがusersテーブル内に存在するかしないかを真偽値で返す関数です。
 *
 * 使用方法
 *
 * const authInfo = {
 *  username: "hogetarou",
 *  id: "1",
 * };
 *
 * const result = await verifyIdAndUsername(db, authInfo);
 *
 * if (result) {
 *  ユーザーが存在する場合
 * } else {
 *  ユーザーが存在しない場合
 * };
 *
 * @param db // PostgresPool
 * @param authInfo // AuthInfomation
 */
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

/**
 * authInfoに記載されているusernameとpasswordがusersテーブル内で一致するかを確認します。 一致する場合は{id:string, username:string}を返します。
 * 一致していない場合は空のオブジェクトを返します。
 * 使用方法
 *
 * const authInfo = {
 *  username: "hogetarou",
 *  password: "piyopiyo"
 * };
 *
 * const result = await verifyUser(db, authInfo);
 *
 * if (Object.keys(result).length) {
 *  パスワードが一致しない場合
 * } else {
 *  パスワードが一致する場合
 * };
 *
 * @param db PostgresPool
 * @param authInfo AuthInfomationByForm
 */
export const verifyUser = async (
  db: Pool,
  authInfo: AuthInfomationByForm
): Promise<AuthInfomation> => {
  const query: QueryConfig = {
    text: "SELECT id,username,password FROM users WHERE username=$1",
    values: [authInfo.username],
  };
  const result = await db.query(query);
  if (!result.rowCount || 
      !bcrypto.compareSync(authInfo.password, result.rows[0].password)
  ) return {};
  return { id: result.rows[0].id, username: result.rows[0].username };
};

/**
 * authInfoに記載されているusernameとpasswordを元に新しいユーザーを作成します。
 * 成功した場合は{status:"ok", message:STRING, username:STRING}と返却し、
 * 失敗した場合は{status:"ng", message:STRING, username:STRING}と返します。
 * 使用方法
 *
 * const authInfo = {
 *  username: "hogetarou",
 *  password: "piyopiyo"
 * };
 *
 * const result = await createNewUser(db, authInfo);
 *
 * if (result.status === "ok") {
 *  成功した場合
 * } else {
 *  失敗した場合
 * };
 * 
 * @param db PostgresPool
 * @param authInfo AuthInfomationByForm
 */
export const createNewUser = async (
  db: Pool,
  authInfo: AuthInfomationByForm,
  saltRound: number
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
      const salt = bcrypto.genSaltSync(saltRound);
      const insertQuery: QueryConfig = {
        text: "INSERT INTO users (username, password) VALUES ($1, $2);",
        values: [authInfo.username, bcrypto.hashSync(authInfo.password, salt)],
      };
      const result = await db.query(insertQuery);
      console.log(result);
      await db.query("COMMIT");
      return {
        status: "ok",
        message: `${result.rowCount}`,
        username: authInfo.username,
      };
    }
  } catch (e) {
    await db.query("ROLLBACK");
    console.log(e);
    return { status: "ng", message: e.message, username: authInfo.username };
  }
};
