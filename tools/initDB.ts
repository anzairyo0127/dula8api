import bcrypto from "bcrypt";
import { Pool } from 'pg';

const uri = "postgres://postgres:example@127.0.0.1:5432/demo";
const conn = new Pool({connectionString: uri});

const createTable = `CREATE TABLE public.users (
    id SERIAL NOT NULL,
    username character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(username)
);`;

const password = "test";
const saltRound = 10;
const salt = bcrypto.genSaltSync(saltRound);

const insertData = `INSERT INTO users (username, password) VALUES 
('pyonkichi', '${bcrypto.hashSync(password, salt)}');`;

(async ()=>{
    console.log({uri});
    console.log('stating initDB...')
    console.log({createTable});
    await conn.query(createTable);
    console.log({insertData});
    await conn.query(insertData);
    console.log('compleate')
    await conn.end();
})();
