import { Pool } from "pg";

const uri = "postgres://postgres:example@127.0.0.1:5432/demo";
const conn = new Pool({ connectionString: uri });

export const test_table: string = "users";

const dropTable = `DROP TABLE ${test_table}`;

(async () => {
  console.log({ uri });
  console.log("killing testDB...");
  console.log({ dropTable });
  await conn.query(dropTable);
  await conn.end();
})();
