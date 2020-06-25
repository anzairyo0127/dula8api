import bcrypto from "bcrypt";
import { Pool } from "pg";

export interface DelPostsColumn{
    id:string,
    post_id:string,
    password:string,
    created_at:string,
}

export interface responseJson {
    status:number,
    date:string,
    message,
    count:number,
}

export class DelPosts{
    private readonly client:Pool;
    public tableName: String;
    public postsTable: String;
    private superDell: string;
    private hashRound:number = 3; // ストレッチング

    constructor(conn:Pool, tableName?:string, rtable?:string){
        this.client = conn;
        this.tableName = tableName || "del_posts";
        this.postsTable = rtable || "posts";
        this.superDell = process.env.SUPER_DELL;
    }

    retJson (status:number, message, count:number) {
        let ret:responseJson;
        const date = new Date();
        ret = {
            status,
            date: date.toISOString(),
            message,
            count
        }
        return ret;
    };

    public async insertDelPassword(post_id:string, password:string) {
        let message;
        const hashedPassword = bcrypto.hashSync(password, this.hashRound);
        const query = {
            text: `INSERT INTO ${this.tableName} (post_id, password) VALUES ($1, $2);`,
            values: [post_id, hashedPassword]
        };
        await this.client.query(query).then(function(result){
            message = result.rows;
        }).catch(function(reason){
            message = reason.message;
        });
        return message;
    }

    async auth(post_id:string, password:string) {
        let message;
        let ret:responseJson;

        if ( password == this.superDell ) {
            // 特殊なパスワードで削除する場合
            message = await this.delete(post_id);
            ret = this.retJson(200, message, 0)
            return ret;
        } else {
            // 通常のパスワードで削除する場合
            let query = {
                text:`SELECT password FROM ${this.tableName} WHERE post_id=$1`,
                values: [post_id]
            }
            const searchResult = await this.client.query(query);
            if ( searchResult.rowCount == 0 ){
                // そもそもパスワードを持っていない場合
                ret = this.retJson(404, 'This post has no password.', 0)
                return ret;
            } else {
                const hasedPass = await searchResult.rows[0].password;
                if ( bcrypto.compareSync(password, hasedPass) ){
                    // パスワードが合致する場合
                    message = await this.delete(post_id);
                    ret = this.retJson(200, message, 0)
                    return ret;
                } else {
                    // パスワードが合致しない場合。
                    ret = this.retJson(401, 'Not match Password', 0)
                    return ret;
                }
            }    
        }
    }

    private async delete (id:string) {
        let message:string;
        const query = {
            text: `DELETE FROM ${this.postsTable} WHERE id=$1`,
            values: [id]
        }
        await this.client.query(query).then((result) => {
            message = 'OK';
        }).catch((reason) => {
            message = reason.message;
        });
        return message;
    }
}