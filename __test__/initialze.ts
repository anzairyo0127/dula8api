import {Pool} from 'pg';
//import {test_table, test_table2} from './Posts.test'
const [test_table, test_table2] = ["table", "table2"]

export async function initialize (pool:Pool) {
    const createTable = `CREATE TABLE IF NOT EXISTS ${test_table} (
        id SERIAL PRIMARY KEY NOT NULL,
        title character varying(256) NOT NULL,
        text text NOT NULL,
        name character varying(256) NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    );`;

    const createTable2 = `CREATE TABLE IF NOT EXISTS ${test_table2} (
        id SERIAL NOT NULL,
        post_id INT references ${test_table}(id) ON DELETE CASCADE,
        password character varying(512) NOT NULL,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    );`;

    const insertText = `INSERT INTO ${test_table} (title, text, name) VALUES`
    const insertData1 = `${insertText} ('タイトルテスト', 'テストです', 'テスト人');`;
    const insertData2 = `${insertText} ('タンクトップ仮面です。', 'こんばんは、タンクトップ仮面です。', 'タンクトップ仮面')`;
    const insertData3 = `${insertText} ('ぴょわああああ', 'うわああああああん', 'ぽんきち');`;

    await pool.query(createTable);
    await pool.query(createTable2);
    await pool.query(insertData1);
    await pool.query(insertData2);
    await pool.query(insertData3);
}