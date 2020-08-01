import bcrypto from "bcrypt";
import { Pool } from "pg";

const table = "users";
const testUser = {
  username: "appps",
  password: "test",
};

export const init = async (pool: Pool, saltRound:number): Promise<void> => {
  const salt = bcrypto.genSaltSync(saltRound);  
  const createTable = `CREATE TABLE public.${table} (
      id SERIAL NOT NULL,
      username character varying(256) NOT NULL,
      password character varying(256) NOT NULL,
      created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      UNIQUE(username)
  );`;

  const insertTestUserData = {
    text: `INSERT INTO ${table} (username, password) VALUES ($1, $2);`,
    values: [testUser.username, bcrypto.hashSync(testUser.password, salt)],
  };

  await pool.query(createTable);
  await pool.query(insertTestUserData);
  return;
};
