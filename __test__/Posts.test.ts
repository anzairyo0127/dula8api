import bcrypto from "bcrypt";


import { Pool } from 'pg';

import { initialize } from './initialze';
import { Posts } from '../src/Models/Posts';
import { DelPosts } from '../src/Models/DelPosts';

let conn:Pool;
let posts:Posts;
let delPosts:DelPosts;
const uri = process.env.DATABASE_URL;

const superDell = process.env.SUPER_DELL;

export const test_table:string = 'test_posts';
export const test_table2:string = 'test_del_posts'
describe('Posts.js test.', () => {
    beforeAll(async () => {
        conn = new Pool({connectionString: uri});
        await initialize(conn);
        posts = new Posts(conn, test_table);
        delPosts = new DelPosts(conn, test_table2, test_table);
    });
    test('getLastRow()', async()=>{
        const lastRow = await posts.getLastVal();
        expect(lastRow).toBe("3");
    });
    test('Posts.row()', async () => {
        const testRow = await posts.row('1');
        expect(testRow.message[0].id).toBe(1);
        expect(testRow.message[0].title).toBe('タイトルテスト');
        expect(testRow.message[0].text).toBe('テストです');
        expect(testRow.message[0].name).toBe('テスト人');
    });
    test('Posts.post()', async () => {
        const a = await posts.post({title:'titletest', text:'texttest', name:'nametest'});
        const testRow = await posts.rows();
        expect(testRow.message[0].title).toBe('titletest');
        expect(testRow.message[0].text).toBe('texttest');
        expect(testRow.message[0].name).toBe('nametest');
    });
    test('DelPosts.insertDelPassword()', async () => {
        await delPosts.insertDelPassword('1','hogehoge');
        const pass = await conn.query(`SELECT * FROM ${test_table2} AS t1 WHERE t1.post_id=1`);
        expect(bcrypto.compareSync('hogehoge', pass.rows[0].password)).toBeTruthy();
        await delPosts.auth('1', 'hogehoge');
        const answer = await conn.query(`SELECT * FROM ${test_table2} AS t1 WHERE t1.post_id=1`);
        expect(answer.rowCount).toBe(0);
        await delPosts.insertDelPassword('2','fugafuga');
        await delPosts.auth('2', 'piyopiyo');
        const answer2 = await conn.query(`SELECT * FROM ${test_table2} AS t1 WHERE t1.post_id=2`);
        expect(answer2.rowCount).toBe(1);
        await delPosts.auth('2', superDell);
        const answer3 = await conn.query(`SELECT * FROM ${test_table2} AS t1 WHERE t1.post_id=2`);
        expect(answer3.rowCount).toBe(0);
    });
    afterAll(async () => {
        await conn.query(`DROP TABLE ${test_table2} CASCADE`);
        await conn.query(`DROP TABLE ${test_table}`);
        await conn.end();
    });
});
