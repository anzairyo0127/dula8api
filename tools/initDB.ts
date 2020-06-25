import { Pool } from 'pg';
import { connect } from 'http2';

const uri = <string>process.env.DATABASE_URL;

const conn = new Pool({connectionString: uri});

const createTable = `CREATE TABLE public.posts (
    id SERIAL  NOT NULL,
    title character varying(256) NOT NULL,
    text text NOT NULL,
    name character varying(256) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

const createTable2 = `CREATE TABLE public.del_posts (
    id SERIAL NOT NULL,
    post_id INT NOT NULL,
    password character varying(256) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

const insertData = `INSERT INTO posts (title, text, name) VALUES 
('タイトルテスト', 'テストです', 'テスト人'),
('タンクトップ仮面です。', 'こんばんは、タンクトップ仮面です。', 'タンクトップ仮面'),
('ぴょわああああ', 'うわああああああん', 'ぽんきち');`;

(async ()=>{
    console.log({uri});
    console.log('stating initDB...')
    console.log({createTable});
    await conn.query(createTable);
    console.log({createTable2});
    await conn.query(createTable2);
    console.log({insertData});
    await conn.query(insertData);
    console.log('compleate')
    await conn.end();
})();
