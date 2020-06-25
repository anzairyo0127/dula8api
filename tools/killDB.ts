import { Pool } from 'pg';

const uri = <string>process.env.DATABASE_URL;
const conn = new Pool({connectionString: uri});

export const test_table:string = 'posts';
export const test_table2:string = 'del_posts'

const dropTable = `DROP TABLE ${test_table}`;
const dropTable2 = `DROP TABLE ${test_table2}`;


(async ()=>{
    console.log({uri});
    console.log('killing testDB...')
    console.log({dropTable});
    await conn.query(dropTable);
    console.log({dropTable2});
    await conn.query(dropTable2);
    await conn.end()
})();
